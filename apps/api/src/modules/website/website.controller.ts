import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { CreateFamilyApplicationDto } from "./dto/create-family-application.dto";
import { CreateNannyApplicationDto } from "./dto/create-nanny-application.dto";
import { CreateWebsiteRequestDto } from "./dto/create-website-request.dto";
import { UpsertWebsiteContentDto } from "./dto/upsert-website-content.dto";
import { UpsertWebsiteSettingDto } from "./dto/upsert-website-setting.dto";
import { WebsiteService } from "./website.service";

@Controller("api/v1/public")
export class PublicWebsiteController {
  constructor(private readonly service: WebsiteService) {}

  @Get("site-settings")
  siteSettings() {
    return this.service.getSiteSettings();
  }

  @Get("navigation")
  navigation() {
    return this.service.getNavigation();
  }

  @Get("homepage")
  homepage() {
    return this.service.getHomepage();
  }

  @Get("pages/:slug")
  page(@Param("slug") slug: string) {
    return this.service.getPage(slug);
  }

  @Get("services")
  services() {
    return this.service.listByType("SERVICE");
  }

  @Get("services/:slug")
  servicePage(@Param("slug") slug: string) {
    return this.service.getService(slug);
  }

  @Get("locations")
  locations() {
    return this.service.listByType("LOCATION");
  }

  @Get("locations/:slug")
  location(@Param("slug") slug: string) {
    return this.service.getLocation(slug);
  }

  @Get("blog/posts")
  blogPosts() {
    return this.service.listByType("BLOG_POST");
  }

  @Get("blog/posts/:slug")
  blogPost(@Param("slug") slug: string) {
    return this.service.getBlogPost(slug);
  }

  @Get("blog/categories")
  blogCategories() {
    return this.service.listBlogCategories();
  }

  @Get("faqs")
  faqs() {
    return this.service.listFaqs();
  }

  @Get("testimonials")
  testimonials() {
    return this.service.listTestimonials();
  }

  @Get("whatsapp-settings")
  whatsappSettings() {
    return this.service.getWhatsAppSettings();
  }

  @Post("applications/family")
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  familyApplication(
    @Body() dto: CreateFamilyApplicationDto,
    @Req() req: { headers: Record<string, string | undefined>; ip: string }
  ) {
    return this.service.submitFamilyApplication(dto, req.ip, req.headers["user-agent"]);
  }

  @Post("applications/nanny")
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  nannyApplication(
    @Body() dto: CreateNannyApplicationDto,
    @Req() req: { headers: Record<string, string | undefined>; ip: string }
  ) {
    return this.service.submitNannyApplication(dto, req.ip, req.headers["user-agent"]);
  }

  @Post("contact-requests")
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  contactRequest(
    @Body() dto: CreateWebsiteRequestDto,
    @Req() req: { headers: Record<string, string | undefined>; ip: string }
  ) {
    return this.service.submitWebsiteRequest("contact_request", dto, req.ip, req.headers["user-agent"]);
  }

  @Post("callback-requests")
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  callbackRequest(
    @Body() dto: CreateWebsiteRequestDto,
    @Req() req: { headers: Record<string, string | undefined>; ip: string }
  ) {
    return this.service.submitWebsiteRequest("callback_request", dto, req.ip, req.headers["user-agent"]);
  }

  @Post("newsletter-subscriptions")
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  newsletterSubscription(
    @Body() dto: CreateWebsiteRequestDto,
    @Req() req: { headers: Record<string, string | undefined>; ip: string }
  ) {
    return this.service.submitWebsiteRequest("newsletter_subscription", dto, req.ip, req.headers["user-agent"]);
  }
}

@Controller("api/v1/admin/website")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminWebsiteController {
  constructor(private readonly service: WebsiteService) {}

  @Get("dashboard")
  @RequirePermissions("settings.manage")
  dashboard() {
    return this.service.getDashboard();
  }

  @Get("pages")
  @RequirePermissions("settings.manage")
  pages() {
    return this.service.listContent("PAGE");
  }

  @Post("pages")
  @RequirePermissions("settings.manage")
  upsertPage(@Body() dto: UpsertWebsiteContentDto) {
    return this.service.upsertContent(null, { ...dto, type: "PAGE" });
  }

  @Get("pages/:id")
  @RequirePermissions("settings.manage")
  getPage(@Param("id") id: string) {
    return this.service.getContentById(id);
  }

  @Patch("pages/:id")
  @RequirePermissions("settings.manage")
  updatePage(@Param("id") id: string, @Body() dto: UpsertWebsiteContentDto) {
    return this.service.upsertContent(id, { ...dto, type: "PAGE" });
  }

  @Delete("pages/:id")
  @RequirePermissions("settings.manage")
  deletePage(@Param("id") id: string) {
    return this.service.deleteContent(id);
  }

  @Get("settings")
  @RequirePermissions("settings.manage")
  settings() {
    return this.service.listSettings();
  }

  @Patch("settings")
  @RequirePermissions("settings.manage")
  upsertSetting(@Body() dto: UpsertWebsiteSettingDto) {
    return this.service.upsertSetting(dto);
  }

  @Get("form-submissions")
  @RequirePermissions("settings.manage")
  formSubmissions() {
    return this.service.listPublicFormSubmissions();
  }

  @Get("integration-logs")
  @RequirePermissions("settings.manage")
  integrationLogs() {
    return this.service.listIntegrationLogs();
  }
}
