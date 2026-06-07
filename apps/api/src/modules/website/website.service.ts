import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, WebsiteContentStatus, WebsiteContentType, WebsiteSubmissionStatus } from "@prisma/client";
import { createHash } from "node:crypto";
import { ApplicationsService } from "../applications/applications.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateFamilyApplicationDto } from "./dto/create-family-application.dto";
import { CreateNannyApplicationDto } from "./dto/create-nanny-application.dto";
import { CreateWebsiteRequestDto } from "./dto/create-website-request.dto";
import { UpsertWebsiteContentDto } from "./dto/upsert-website-content.dto";
import { UpsertWebsiteSettingDto } from "./dto/upsert-website-setting.dto";

type PublicContent = Prisma.WebsiteContentGetPayload<{}>;

function normalizeSlug(value: string): string {
  return value.trim().replace(/\s+/g, "-").toLowerCase();
}

@Injectable()
export class WebsiteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicationsService: ApplicationsService
  ) {}

  async getSiteSettings() {
    const settings = await this.prisma.websiteSetting.findMany({ orderBy: { key: "asc" } });
    return settings.reduce<Record<string, unknown>>((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }

  async getNavigation() {
    const navigation = await this.prisma.websiteContent.findFirst({
      where: { type: WebsiteContentType.NAVIGATION, status: WebsiteContentStatus.PUBLISHED }
    });
    return navigation?.payload ?? { items: [] };
  }

  async getHomepage() {
    return this.getSingleContent(WebsiteContentType.HOME, "home");
  }

  async getPage(slug: string) {
    return this.getSingleContent(WebsiteContentType.PAGE, slug);
  }

  async getService(slug: string) {
    return this.getSingleContent(WebsiteContentType.SERVICE, slug);
  }

  async getLocation(slug: string) {
    return this.getSingleContent(WebsiteContentType.LOCATION, slug);
  }

  async getBlogPost(slug: string) {
    return this.getSingleContent(WebsiteContentType.BLOG_POST, slug);
  }

  async listContent(type: WebsiteContentType) {
    return this.prisma.websiteContent.findMany({
      where: { type, status: { in: [WebsiteContentStatus.PUBLISHED, WebsiteContentStatus.DRAFT, WebsiteContentStatus.SCHEDULED] } },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }]
    });
  }

  async listByType(type: WebsiteContentType) {
    return this.listContent(type);
  }

  async listFaqs() {
    return this.listContent(WebsiteContentType.FAQ);
  }

  async listTestimonials() {
    return this.listContent(WebsiteContentType.TESTIMONIAL);
  }

  async listBlogCategories() {
    return this.listContent(WebsiteContentType.BLOG_CATEGORY);
  }

  async submitFamilyApplication(dto: CreateFamilyApplicationDto, ip?: string, userAgent?: string) {
    this.assertSpamChecks(dto.honeypot, dto.submitted_at);

    const payload = dto.payload ?? {};
    const idempotencyKey = dto.idempotency_key?.trim() || null;
    await this.assertSubmissionUnique("family_application", idempotencyKey, dto.phone);

    const [family, request] = await this.prisma.$transaction(async (tx) => {
      const createdFamily = await tx.family.create({
        data: {
          family_name: dto.full_name.trim(),
          primary_contact_name: dto.full_name.trim(),
          primary_contact_phone: dto.phone.trim(),
          primary_contact_email: dto.email?.trim() || undefined,
          city: dto.city?.trim() || undefined,
          district: dto.district?.trim() || undefined,
          source: dto.source ?? "WEBSITE",
          status: "LEAD"
        }
      });

      const createdRequest = await tx.familyRequest.create({
        data: {
          family_id: createdFamily.id,
          title: `Website aile başvurusu - ${createdFamily.family_name}`,
          status: "OPEN",
          city: dto.city?.trim() || undefined,
          district: dto.district?.trim() || undefined,
          salary_min: dto.budget_min !== undefined ? dto.budget_min : undefined,
          salary_max: dto.budget_max !== undefined ? dto.budget_max : undefined,
          description: dto.notes
            ? [dto.working_hours ? `Çalışma saatleri: ${dto.working_hours}` : null, dto.notes]
                .filter(Boolean)
                .join("\n\n")
            : dto.working_hours
              ? `Çalışma saatleri: ${dto.working_hours}`
              : undefined,
          requirements_json: payload as Prisma.InputJsonValue
        }
      });

      await tx.task.create({
        data: {
          title: `Yeni aile başvurusu: ${createdFamily.family_name}`,
          description: "Website üzerinden gelen aile başvurusu incelenecek.",
          status: "TODO",
          priority: 8,
          entity_type: "family_request",
          entity_id: createdRequest.id
        }
      });

      await tx.websiteFormSubmission.create({
        data: {
          form_type: "family_application",
          status: WebsiteSubmissionStatus.SYNCED,
          idempotency_key: idempotencyKey ?? undefined,
          payload: payload as Prisma.InputJsonValue,
          crm_entity_type: "FamilyRequest",
          crm_entity_id: createdRequest.id,
          source: dto.source ?? "website",
          ip_hash: this.hashIp(ip),
          user_agent: userAgent ?? null
        }
      });

      await tx.auditLog.create({
        data: {
          action: "website.family_application.created",
          entity_type: "FamilyRequest",
          entity_id: createdRequest.id,
          metadata: {
            familyId: createdFamily.id,
            source: dto.source ?? "website"
          },
          ip_address: ip ?? null,
          user_agent: userAgent ?? null
        }
      });

      return [createdFamily, createdRequest] as const;
    });

    return {
      family,
      familyRequest: request,
      nextStep: "/tesekkurler/aile-basvurusu"
    };
  }

  async submitNannyApplication(dto: CreateNannyApplicationDto, ip?: string, userAgent?: string) {
    this.assertSpamChecks(dto.honeypot, dto.submitted_at);
    const payload = dto.payload ?? {};
    const idempotencyKey = dto.idempotency_key?.trim() || null;
    await this.assertSubmissionUnique("nanny_application", idempotencyKey, dto.phone);

    const fullName = dto.full_name.trim();
    const [firstNamePart, ...rest] = fullName.split(/\s+/);
    const firstName = firstNamePart || fullName || "Aday";
    const lastName = rest.join(" ") || "Aday";
    const publicApplication = await this.applicationsService.createPublicApplication(
      {
        first_name: firstName,
        last_name: lastName,
        phone: dto.phone.trim(),
        email: dto.email?.trim(),
        city: dto.city?.trim(),
        district: dto.district?.trim(),
        birth_date: dto.birth_date,
        source: dto.source ?? "WEBSITE",
        notes: "Website nanny application"
      },
      {
        ...payload,
        submittedFrom: "website"
      }
    );

    await this.prisma.websiteFormSubmission.create({
      data: {
        form_type: "nanny_application",
        status: WebsiteSubmissionStatus.SYNCED,
        idempotency_key: idempotencyKey ?? undefined,
        payload: payload as Prisma.InputJsonValue,
        crm_entity_type: "CandidateApplication",
        crm_entity_id: publicApplication.id,
        source: dto.source ?? "website",
        ip_hash: this.hashIp(ip),
        user_agent: userAgent ?? null
      }
    });

    await this.prisma.auditLog.create({
      data: {
        action: "website.nanny_application.created",
        entity_type: "CandidateApplication",
        entity_id: publicApplication.id,
        metadata: {
          source: dto.source ?? "website"
        },
        ip_address: ip ?? null,
        user_agent: userAgent ?? null
      }
    });

    return {
      application: publicApplication,
      nextStep: "/tesekkurler/dadi-basvurusu"
    };
  }

  async submitWebsiteRequest(
    formType: "contact_request" | "callback_request" | "newsletter_subscription",
    dto: CreateWebsiteRequestDto,
    ip?: string,
    userAgent?: string
  ) {
    this.assertSpamChecks(dto.honeypot, dto.submitted_at);

    const idempotencyKey = dto.idempotency_key?.trim() || null;
    await this.assertSubmissionUnique(formType, idempotencyKey, dto.phone);

    const payload = {
      ...(dto.payload ?? {}),
      full_name: dto.full_name.trim(),
      phone: dto.phone?.trim() || null,
      email: dto.email?.trim() || null,
      message: dto.message?.trim() || null,
      preferred_time: dto.preferred_time?.trim() || null,
      consent: dto.consent ?? false,
      marketing_consent: dto.marketing_consent ?? false
    };

    const submission = await this.prisma.websiteFormSubmission.create({
      data: {
        form_type: formType,
        status: WebsiteSubmissionStatus.NEW,
        idempotency_key: idempotencyKey ?? undefined,
        payload: payload as Prisma.InputJsonValue,
        source: dto.source ?? "website",
        ip_hash: this.hashIp(ip),
        user_agent: userAgent ?? null
      }
    });

    await this.prisma.auditLog.create({
      data: {
        action: `website.${formType}.created`,
        entity_type: "WebsiteFormSubmission",
        entity_id: submission.id,
        metadata: { formType },
        ip_address: ip ?? null,
        user_agent: userAgent ?? null
      }
    });

    return {
      submissionId: submission.id,
      nextStep: formType === "newsletter_subscription" ? "/tesekkurler/iletisim" : "/tesekkurler/iletisim"
    };
  }

  async upsertSetting(dto: UpsertWebsiteSettingDto) {
    return this.prisma.websiteSetting.upsert({
      where: { key: dto.key },
      create: {
        key: dto.key,
        group: dto.group,
        value: dto.value as Prisma.InputJsonValue
      },
      update: {
        group: dto.group,
        value: dto.value as Prisma.InputJsonValue
      }
    });
  }

  async listSettings() {
    return this.prisma.websiteSetting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
  }

  async getWhatsAppSettings() {
    return this.prisma.websiteWhatsAppSetting.findFirst({
      orderBy: { created_at: "desc" }
    });
  }

  async listPublicFormSubmissions() {
    return this.prisma.websiteFormSubmission.findMany({ orderBy: { created_at: "desc" } });
  }

  async listIntegrationLogs() {
    return this.prisma.websiteIntegrationLog.findMany({ orderBy: { created_at: "desc" } });
  }

  async upsertContent(id: string | null, dto: UpsertWebsiteContentDto) {
    const slug = dto.slug ? normalizeSlug(dto.slug) : null;
    const data = {
      type: dto.type,
      slug: slug ?? undefined,
      title: dto.title,
      status: dto.status ?? WebsiteContentStatus.DRAFT,
      hero_title: dto.hero_title ?? undefined,
      hero_subtitle: dto.hero_subtitle ?? undefined,
      payload: dto.payload as Prisma.InputJsonValue,
      seo_title: dto.seo_title ?? undefined,
      meta_description: dto.meta_description ?? undefined,
      canonical_url: dto.canonical_url ?? undefined,
      robots: dto.robots ?? undefined,
      published_at:
        dto.status === WebsiteContentStatus.PUBLISHED ? new Date() : undefined
    };

    if (id) {
      const existing = await this.prisma.websiteContent.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException("Website content not found");
      return this.prisma.websiteContent.update({ where: { id }, data });
    }

    return this.prisma.websiteContent.create({ data });
  }

  async getContentById(id: string) {
    const content = await this.prisma.websiteContent.findUnique({ where: { id } });
    if (!content) {
      throw new NotFoundException("Website content not found");
    }
    return content;
  }

  async deleteContent(id: string) {
    await this.prisma.websiteContent.delete({ where: { id } });
    return { success: true };
  }

  async getDashboard() {
    const [pages, submissions, settings, logs] = await Promise.all([
      this.prisma.websiteContent.count(),
      this.prisma.websiteFormSubmission.count(),
      this.prisma.websiteSetting.count(),
      this.prisma.websiteIntegrationLog.count()
    ]);

    return {
      pages,
      submissions,
      settings,
      logs
    };
  }

  private async getSingleContent(type: WebsiteContentType, slug: string): Promise<PublicContent | null> {
    return this.prisma.websiteContent.findFirst({
      where: {
        type,
        slug: normalizeSlug(slug),
        status: WebsiteContentStatus.PUBLISHED
      }
    });
  }

  private assertSpamChecks(honeypot?: string, submittedAt?: string) {
    if (honeypot && honeypot.trim().length > 0) {
      throw new BadRequestException("Suspicious submission detected");
    }

    if (submittedAt) {
      const submitted = new Date(submittedAt).getTime();
      if (!Number.isNaN(submitted) && Date.now() - submitted < 2500) {
        throw new BadRequestException("Form submitted too quickly");
      }
    }
  }

  private async assertSubmissionUnique(
    formType: string,
    idempotencyKey: string | null,
    phone?: string
  ) {
    if (idempotencyKey) {
      const existing = await this.prisma.websiteFormSubmission.findUnique({
        where: { idempotency_key: idempotencyKey }
      });
      if (existing) {
        throw new BadRequestException("Duplicate submission");
      }
    }

    if (phone) {
      const recent = await this.prisma.websiteFormSubmission.findFirst({
        where: {
          form_type: formType,
          created_at: { gte: new Date(Date.now() - 15 * 60 * 1000) },
          payload: {
            path: ["phone"],
            equals: phone
          }
        }
      });

      if (recent) {
        throw new BadRequestException("Duplicate submission");
      }
    }
  }

  private hashIp(ip?: string) {
    if (!ip) return null;
    return createHash("sha256").update(ip).digest("hex");
  }
}
