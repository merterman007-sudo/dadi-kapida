import {
  CandidateApplicationStatus,
  CandidateStatus,
  ContractStatus,
  DocumentStatus,
  FamilyRequestStatus,
  FamilyStatus,
  MeetingStatus,
  MeetingType,
  PaymentStatus,
  PlacementStatus,
  Prisma,
  PrismaClient,
  ReferenceStatus,
  WebsiteContentStatus,
  WebsiteContentType,
  TaskStatus,
  WorkType
} from "@prisma/client";

const prisma = new PrismaClient();
const DEMO_SOURCE = "DEMO_SEED_V1";
const bootstrapAdminEmail = process.env.DADI_KAPIDA_BOOTSTRAP_ADMIN_EMAIL;

if (!bootstrapAdminEmail) {
  throw new Error(
    "Missing bootstrap admin email. Set DADI_KAPIDA_BOOTSTRAP_ADMIN_EMAIL before running prisma demo seed."
  );
}

type CandidateSeed = {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  status: CandidateStatus;
  years: number;
  expectedMin: number;
  expectedMax: number;
  liveIn: boolean;
  workType: WorkType;
  languageLevel: string;
  refStatus: ReferenceStatus;
};

type FamilySeed = {
  familyName: string;
  contactName: string;
  phone: string;
  city: string;
  district: string;
  budgetMin: number;
  budgetMax: number;
  status: FamilyStatus;
  requestTitle: string;
  requestStatus: FamilyRequestStatus;
  workType: WorkType;
  childrenCount: number;
  minExperienceYears: number;
};

const candidateSeeds: CandidateSeed[] = [
  {
    firstName: "Elif",
    lastName: "Yildiz",
    phone: "+905550000101",
    city: "Istanbul",
    district: "Kadikoy",
    status: CandidateStatus.APPROVED,
    years: 6,
    expectedMin: 34000,
    expectedMax: 42000,
    liveIn: false,
    workType: WorkType.DAYTIME,
    languageLevel: "B1",
    refStatus: ReferenceStatus.VERIFIED
  },
  {
    firstName: "Merve",
    lastName: "Kaya",
    phone: "+905550000102",
    city: "Istanbul",
    district: "Besiktas",
    status: CandidateStatus.INTERVIEW,
    years: 4,
    expectedMin: 30000,
    expectedMax: 38000,
    liveIn: true,
    workType: WorkType.LIVE_IN,
    languageLevel: "A2",
    refStatus: ReferenceStatus.CONTACTED
  },
  {
    firstName: "Sena",
    lastName: "Demir",
    phone: "+905550000103",
    city: "Istanbul",
    district: "Sisli",
    status: CandidateStatus.REFERENCE_CHECK,
    years: 8,
    expectedMin: 38000,
    expectedMax: 46000,
    liveIn: false,
    workType: WorkType.FULL_TIME,
    languageLevel: "B2",
    refStatus: ReferenceStatus.VERIFIED
  },
  {
    firstName: "Derya",
    lastName: "Akin",
    phone: "+905550000104",
    city: "Istanbul",
    district: "Uskudar",
    status: CandidateStatus.DOCUMENT_PENDING,
    years: 5,
    expectedMin: 32000,
    expectedMax: 40000,
    liveIn: true,
    workType: WorkType.NIGHT,
    languageLevel: "A2",
    refStatus: ReferenceStatus.NEW
  },
  {
    firstName: "Gizem",
    lastName: "Arslan",
    phone: "+905550000105",
    city: "Istanbul",
    district: "Atasehir",
    status: CandidateStatus.PRE_SCREEN,
    years: 3,
    expectedMin: 28000,
    expectedMax: 35000,
    liveIn: false,
    workType: WorkType.PART_TIME,
    languageLevel: "A1",
    refStatus: ReferenceStatus.NEW
  },
  {
    firstName: "Asli",
    lastName: "Kilic",
    phone: "+905550000106",
    city: "Istanbul",
    district: "Beykoz",
    status: CandidateStatus.APPROVED,
    years: 7,
    expectedMin: 36000,
    expectedMax: 44000,
    liveIn: true,
    workType: WorkType.LIVE_IN,
    languageLevel: "B1",
    refStatus: ReferenceStatus.VERIFIED
  }
];

const familySeeds: FamilySeed[] = [
  {
    familyName: "Cetin Family",
    contactName: "Ayse Cetin",
    phone: "+905551100201",
    city: "Istanbul",
    district: "Kadikoy",
    budgetMin: 32000,
    budgetMax: 43000,
    status: FamilyStatus.ACTIVE,
    requestTitle: "Weekday daytime nanny",
    requestStatus: FamilyRequestStatus.MATCHING,
    workType: WorkType.DAYTIME,
    childrenCount: 1,
    minExperienceYears: 3
  },
  {
    familyName: "Sahin Family",
    contactName: "Burak Sahin",
    phone: "+905551100202",
    city: "Istanbul",
    district: "Besiktas",
    budgetMin: 36000,
    budgetMax: 50000,
    status: FamilyStatus.QUALIFIED,
    requestTitle: "Live-in nanny with first aid",
    requestStatus: FamilyRequestStatus.OPEN,
    workType: WorkType.LIVE_IN,
    childrenCount: 2,
    minExperienceYears: 5
  },
  {
    familyName: "Aydin Family",
    contactName: "Zeynep Aydin",
    phone: "+905551100203",
    city: "Istanbul",
    district: "Uskudar",
    budgetMin: 30000,
    budgetMax: 39000,
    status: FamilyStatus.ACTIVE,
    requestTitle: "Night shift newborn care",
    requestStatus: FamilyRequestStatus.INTERVIEWING,
    workType: WorkType.NIGHT,
    childrenCount: 1,
    minExperienceYears: 4
  },
  {
    familyName: "Koc Family",
    contactName: "Murat Koc",
    phone: "+905551100204",
    city: "Istanbul",
    district: "Atasehir",
    budgetMin: 25000,
    budgetMax: 34000,
    status: FamilyStatus.LEAD,
    requestTitle: "Part-time weekend support",
    requestStatus: FamilyRequestStatus.DRAFT,
    workType: WorkType.PART_TIME,
    childrenCount: 2,
    minExperienceYears: 2
  }
];

function plusDays(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function mustAt<T>(arr: T[], index: number, label: string): T {
  const value = arr[index];
  if (!value) {
    throw new Error(`${label} not found at index ${index}`);
  }
  return value;
}

async function cleanupDemoData() {
  const demoCandidates = await prisma.candidate.findMany({
    where: { source: DEMO_SOURCE },
    select: { id: true }
  });
  const candidateIds = demoCandidates.map((candidate) => candidate.id);

  if (candidateIds.length > 0) {
    const candidateReferences = await prisma.candidateReference.findMany({
      where: { candidate_id: { in: candidateIds } },
      select: { id: true }
    });
    const referenceIds = candidateReferences.map((reference) => reference.id);

    if (referenceIds.length > 0) {
      await prisma.referenceCheck.deleteMany({ where: { candidate_reference_id: { in: referenceIds } } });
    }

    await prisma.candidateReference.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateWorkPreference.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateExperience.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateSkill.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateCertification.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateLanguage.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateDocument.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateInterview.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateStatusHistory.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateBlacklistRecord.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.candidateMatch.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.shortlistItem.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.meeting.deleteMany({ where: { candidate_id: { in: candidateIds } } });
    await prisma.contract.deleteMany({ where: { candidate_id: { in: candidateIds } } });

    const candidatePlacements = await prisma.placement.findMany({
      where: { candidate_id: { in: candidateIds } },
      select: { id: true }
    });
    const candidatePlacementIds = candidatePlacements.map((placement) => placement.id);
    if (candidatePlacementIds.length > 0) {
      await prisma.placementStatusHistory.deleteMany({ where: { placement_id: { in: candidatePlacementIds } } });
      await prisma.contract.deleteMany({ where: { placement_id: { in: candidatePlacementIds } } });
      const invoices = await prisma.invoice.findMany({
        where: { placement_id: { in: candidatePlacementIds } },
        select: { id: true }
      });
      const invoiceIds = invoices.map((invoice) => invoice.id);
      if (invoiceIds.length > 0) {
        await prisma.payment.deleteMany({ where: { invoice_id: { in: invoiceIds } } });
      }
      await prisma.invoice.deleteMany({ where: { id: { in: invoiceIds } } });
      await prisma.placement.deleteMany({ where: { id: { in: candidatePlacementIds } } });
    }

    await prisma.note.deleteMany({
      where: {
        entity_type: "CANDIDATE",
        entity_id: { in: candidateIds }
      }
    });
    await prisma.message.deleteMany({
      where: {
        entity_type: "CANDIDATE",
        entity_id: { in: candidateIds }
      }
    });

    await prisma.candidate.deleteMany({ where: { id: { in: candidateIds } } });
  }

  const demoFamilies = await prisma.family.findMany({
    where: { source: DEMO_SOURCE },
    select: { id: true }
  });
  const familyIds = demoFamilies.map((family) => family.id);

  if (familyIds.length > 0) {
    const requests = await prisma.familyRequest.findMany({
      where: { family_id: { in: familyIds } },
      select: { id: true }
    });
    const requestIds = requests.map((request) => request.id);

    if (requestIds.length > 0) {
      const shortlists = await prisma.shortlist.findMany({
        where: { family_request_id: { in: requestIds } },
        select: { id: true }
      });
      const shortlistIds = shortlists.map((shortlist) => shortlist.id);

      if (shortlistIds.length > 0) {
        await prisma.shortlistItem.deleteMany({ where: { shortlist_id: { in: shortlistIds } } });
      }

      await prisma.shortlist.deleteMany({ where: { id: { in: shortlistIds } } });
      await prisma.candidateMatch.deleteMany({ where: { family_request_id: { in: requestIds } } });
      await prisma.matchRun.deleteMany({ where: { family_request_id: { in: requestIds } } });
      await prisma.requestScheduleRule.deleteMany({ where: { family_request_id: { in: requestIds } } });
      await prisma.requestRequiredSkill.deleteMany({ where: { family_request_id: { in: requestIds } } });
      await prisma.requestRequiredCertification.deleteMany({ where: { family_request_id: { in: requestIds } } });

      const placements = await prisma.placement.findMany({
        where: { family_request_id: { in: requestIds } },
        select: { id: true }
      });
      const placementIds = placements.map((placement) => placement.id);
      if (placementIds.length > 0) {
        await prisma.placementStatusHistory.deleteMany({ where: { placement_id: { in: placementIds } } });
        await prisma.contract.deleteMany({ where: { placement_id: { in: placementIds } } });
        const invoices = await prisma.invoice.findMany({
          where: { placement_id: { in: placementIds } },
          select: { id: true }
        });
        const invoiceIds = invoices.map((invoice) => invoice.id);
        if (invoiceIds.length > 0) {
          await prisma.payment.deleteMany({ where: { invoice_id: { in: invoiceIds } } });
        }
        await prisma.invoice.deleteMany({ where: { id: { in: invoiceIds } } });
      }

      await prisma.meeting.deleteMany({ where: { family_request_id: { in: requestIds } } });
      await prisma.task.deleteMany({ where: { entity_type: "FAMILY_REQUEST", entity_id: { in: requestIds } } });
      await prisma.note.deleteMany({ where: { entity_type: "FAMILY_REQUEST", entity_id: { in: requestIds } } });
      await prisma.message.deleteMany({ where: { entity_type: "FAMILY_REQUEST", entity_id: { in: requestIds } } });

      await prisma.familyRequest.deleteMany({ where: { id: { in: requestIds } } });
    }

    await prisma.meeting.deleteMany({ where: { family_id: { in: familyIds } } });
    await prisma.contract.deleteMany({ where: { family_id: { in: familyIds } } });

    const familyInvoices = await prisma.invoice.findMany({
      where: { family_id: { in: familyIds } },
      select: { id: true }
    });
    const familyInvoiceIds = familyInvoices.map((invoice) => invoice.id);
    if (familyInvoiceIds.length > 0) {
      await prisma.payment.deleteMany({ where: { invoice_id: { in: familyInvoiceIds } } });
      await prisma.invoice.deleteMany({ where: { id: { in: familyInvoiceIds } } });
    }

    await prisma.task.deleteMany({ where: { entity_type: "FAMILY", entity_id: { in: familyIds } } });
    await prisma.note.deleteMany({ where: { entity_type: "FAMILY", entity_id: { in: familyIds } } });
    await prisma.message.deleteMany({ where: { entity_type: "FAMILY", entity_id: { in: familyIds } } });

    await prisma.familyMember.deleteMany({ where: { family_id: { in: familyIds } } });
    await prisma.familyAddress.deleteMany({ where: { family_id: { in: familyIds } } });
    await prisma.family.deleteMany({ where: { id: { in: familyIds } } });
  }

  await prisma.candidateApplication.deleteMany({ where: { source: DEMO_SOURCE } });
}

async function main() {
  const owner = await prisma.user.findUnique({
    where: { email: bootstrapAdminEmail },
    select: { id: true }
  });

  if (!owner) {
    throw new Error("Admin user not found. Run pnpm db:seed first.");
  }

  await cleanupDemoData();

  const firstAidSkill = await prisma.skill.findFirst({ where: { name: "Ilk Yardim" }, select: { id: true } });
  const newbornSkill = await prisma.skill.findFirst({ where: { name: "Yeni Dogan Bakimi" }, select: { id: true } });
  const firstAidCert = await prisma.certification.findFirst({
    where: { name: "Ilk Yardim Sertifikasi" },
    select: { id: true }
  });
  const trLang = await prisma.language.findFirst({ where: { code: "tr" }, select: { id: true } });
  const enLang = await prisma.language.findFirst({ where: { code: "en" }, select: { id: true } });
  const serviceCategory = await prisma.serviceCategory.findFirst({ where: { name: "Dadi" }, select: { id: true } });

  await prisma.candidateApplication.createMany({
    data: candidateSeeds.map((candidate, index) => ({
      first_name: candidate.firstName,
      last_name: candidate.lastName,
      phone: candidate.phone,
      city: candidate.city,
      district: candidate.district,
      experience_years: candidate.years,
      expected_salary_min: candidate.expectedMin,
      expected_salary_max: candidate.expectedMax,
      work_type_preference: candidate.workType,
      can_live_in: candidate.liveIn,
      has_first_aid_certificate: true,
      source: DEMO_SOURCE,
      status:
        index % 3 === 0
          ? CandidateApplicationStatus.NEW
          : index % 3 === 1
            ? CandidateApplicationStatus.CONTACTED
            : CandidateApplicationStatus.CONVERTED_TO_CANDIDATE
    }))
  });

  const createdCandidates: Array<{ id: string; firstName: string; phone: string; status: CandidateStatus }> = [];

  for (const seed of candidateSeeds) {
    const candidateId = crypto.randomUUID();
    const candidate = await prisma.candidate.create({
      data: {
        id: candidateId,
        candidate_code: `ADY-${candidateId.replaceAll("-", "").slice(0, 12).toUpperCase()}`,
        first_name: seed.firstName,
        last_name: seed.lastName,
        phone: seed.phone,
        email: `${seed.firstName.toLowerCase()}.${seed.lastName.toLowerCase()}@demo.local`,
        city: seed.city,
        district: seed.district,
        years_of_experience: seed.years,
        expected_salary_min: seed.expectedMin,
        expected_salary_max: seed.expectedMax,
        has_first_aid_certificate: true,
        status: seed.status,
        source: DEMO_SOURCE,
        owner_user_id: owner.id,
        quality_score: Math.min(95, 68 + seed.years * 3),
        interview_score: Math.min(95, 62 + seed.years * 4),
        reference_score: seed.refStatus === ReferenceStatus.VERIFIED ? 88 : 62,
        document_score: seed.status === CandidateStatus.DOCUMENT_PENDING ? 45 : 82
      },
      select: { id: true, first_name: true, phone: true, status: true }
    });

    createdCandidates.push({
      id: candidate.id,
      firstName: candidate.first_name,
      phone: candidate.phone,
      status: candidate.status
    });

    await prisma.candidateWorkPreference.create({
      data: {
        candidate_id: candidate.id,
        work_type: seed.workType,
        can_live_in: seed.liveIn,
        weekend_ok: true,
        night_shift_ok: seed.workType === WorkType.NIGHT,
        min_salary: seed.expectedMin,
        max_salary: seed.expectedMax
      }
    });

    await prisma.candidateExperience.create({
      data: {
        candidate_id: candidate.id,
        title: "Private family nanny",
        description: `Handled daily childcare operations for ${seed.years} years`,
        age_group_experience: "0-6",
        years: seed.years,
        start_date: plusDays(-365 * (seed.years + 1)),
        end_date: plusDays(-30)
      }
    });

    await prisma.candidateReference.create({
      data: {
        candidate_id: candidate.id,
        full_name: `Reference ${seed.firstName}`,
        phone: `+90555999${seed.phone.slice(-4)}`,
        relation: "Previous employer",
        status: seed.refStatus,
        notes: "Demo reference generated by system"
      }
    });

    await prisma.candidateDocument.create({
      data: {
        candidate_id: candidate.id,
        document_type: "ID_CARD",
        file_path: `/demo/docs/${candidate.id}/id-card.pdf`,
        file_name: `${seed.firstName.toLowerCase()}-id-card.pdf`,
        status: seed.status === CandidateStatus.DOCUMENT_PENDING ? DocumentStatus.PENDING : DocumentStatus.VERIFIED,
        expires_at: plusDays(365)
      }
    });

    if (firstAidSkill) {
      await prisma.candidateSkill.create({
        data: {
          candidate_id: candidate.id,
          skill_id: firstAidSkill.id,
          level: "ADVANCED"
        }
      });
    }

    if (newbornSkill) {
      await prisma.candidateSkill.create({
        data: {
          candidate_id: candidate.id,
          skill_id: newbornSkill.id,
          level: "INTERMEDIATE"
        }
      });
    }

    if (firstAidCert) {
      await prisma.candidateCertification.create({
        data: {
          candidate_id: candidate.id,
          certification_id: firstAidCert.id,
          certificate_no: `FA-${seed.phone.slice(-4)}`,
          expires_at: plusDays(720)
        }
      });
    }

    if (trLang) {
      await prisma.candidateLanguage.create({
        data: {
          candidate_id: candidate.id,
          language_id: trLang.id,
          level: "NATIVE"
        }
      });
    }

    if (enLang) {
      await prisma.candidateLanguage.create({
        data: {
          candidate_id: candidate.id,
          language_id: enLang.id,
          level: seed.languageLevel
        }
      });
    }
  }

  const createdFamilies: Array<{ id: string; requestId: string }> = [];

  for (const [index, seed] of familySeeds.entries()) {
    const family = await prisma.family.create({
      data: {
        family_name: seed.familyName,
        primary_contact_name: seed.contactName,
        primary_contact_phone: seed.phone,
        primary_contact_email: `${seed.contactName.toLowerCase().replaceAll(" ", ".")}@demo.local`,
        city: seed.city,
        district: seed.district,
        address: `${seed.district} demo address block ${index + 1}`,
        status: seed.status,
        source: DEMO_SOURCE,
        budget_min: seed.budgetMin,
        budget_max: seed.budgetMax,
        notes: "Demo family created for CRM walkthrough",
        owner_user_id: owner.id
      },
      select: { id: true }
    });

    await prisma.familyMember.createMany({
      data: [
        {
          family_id: family.id,
          full_name: `${seed.familyName} Child A`,
          relation: "Child",
          notes: "Primary care target"
        },
        {
          family_id: family.id,
          full_name: `${seed.familyName} Child B`,
          relation: "Child",
          notes: "Secondary care target"
        }
      ]
    });

    await prisma.familyAddress.create({
      data: {
        family_id: family.id,
        title: "Home",
        city: seed.city,
        district: seed.district,
        address_line: `${seed.district} main street no:${40 + index}`,
        is_primary: true
      }
    });

    const request = await prisma.familyRequest.create({
      data: {
        family_id: family.id,
        title: seed.requestTitle,
        status: seed.requestStatus,
        priority: 5 - index,
        service_category_id: serviceCategory?.id ?? null,
        work_type: seed.workType,
        start_date: plusDays(3 + index),
        salary_min: seed.budgetMin,
        salary_max: seed.budgetMax,
        city: seed.city,
        district: seed.district,
        children_count: seed.childrenCount,
        child_age_groups: seed.childrenCount > 1 ? "0-2,3-6" : "0-2",
        requires_first_aid: true,
        requires_non_smoker: true,
        min_experience_years: seed.minExperienceYears,
        preferred_education_level: "High School+",
        required_language: "Turkish",
        required_language_level: "B1",
        has_pets: index % 2 === 0,
        live_in_room_available: seed.workType === WorkType.LIVE_IN,
        description: "Demo request generated for realistic CRM testing",
        owner_user_id: owner.id,
        requirements_json: {
          specialNotes: "Needs punctuality and routine reporting",
          weeklyReport: true
        },
        match_weights_json: {
          location: 20,
          salary: 15,
          experience: 25,
          language: 10,
          references: 15,
          documents: 15
        }
      },
      select: { id: true }
    });

    await prisma.requestScheduleRule.createMany({
      data: [
        { family_request_id: request.id, day_of_week: 1, start_time: "08:00", end_time: "18:00" },
        { family_request_id: request.id, day_of_week: 2, start_time: "08:00", end_time: "18:00" },
        { family_request_id: request.id, day_of_week: 3, start_time: "08:00", end_time: "18:00" }
      ]
    });

    if (firstAidSkill) {
      await prisma.requestRequiredSkill.create({
        data: {
          family_request_id: request.id,
          skill_id: firstAidSkill.id,
          level: "ADVANCED",
          is_required: true
        }
      });
    }

    if (firstAidCert) {
      await prisma.requestRequiredCertification.create({
        data: {
          family_request_id: request.id,
          certification_id: firstAidCert.id,
          is_required: true
        }
      });
    }

    createdFamilies.push({ id: family.id, requestId: request.id });
  }

  for (const family of createdFamilies.slice(0, 3)) {
    const run = await prisma.matchRun.create({
      data: {
        family_request_id: family.requestId,
        run_by_user_id: owner.id,
        result_count: 3,
        weights_json: {
          experience: 25,
          salary: 20,
          location: 20,
          references: 15,
          documents: 20
        }
      },
      select: { id: true }
    });

    for (const [index, candidate] of createdCandidates.slice(0, 3).entries()) {
      await prisma.candidateMatch.create({
        data: {
          match_run_id: run.id,
          family_request_id: family.requestId,
          candidate_id: candidate.id,
          status: index === 0 ? "SHORTLISTED" : "SUGGESTED",
          total_score: 78 + index * 6,
          location_score: 70 + index * 5,
          salary_score: 72 + index * 4,
          experience_score: 80 + index * 4,
          reference_score: 74 + index * 5,
          document_score: 69 + index * 4,
          language_score: 65 + index * 3,
          explanation_json: {
            summary: "Candidate aligns with key family criteria",
            candidateStatus: candidate.status
          }
        }
      });
    }
  }

  const primaryShortlist = await prisma.shortlist.create({
    data: {
      family_request_id: mustAt(createdFamilies, 0, "family").requestId,
      title: "High confidence candidates",
      notes: "Prepared after first matching run",
      created_by_user_id: owner.id
    },
    select: { id: true }
  });

  await prisma.shortlistItem.createMany({
    data: [
      {
        shortlist_id: primaryShortlist.id,
        candidate_id: mustAt(createdCandidates, 0, "candidate").id,
        consultant_note: "Strong first aid background, good communication",
        sent_to_family_at: new Date(),
        family_feedback: "Positive"
      },
      {
        shortlist_id: primaryShortlist.id,
        candidate_id: mustAt(createdCandidates, 1, "candidate").id,
        consultant_note: "Flexible schedule, needs one more reference check"
      }
    ]
  });

  await prisma.meeting.createMany({
    data: [
      {
        type: MeetingType.FAMILY_INTAKE,
        status: MeetingStatus.COMPLETED,
        title: "Family intake and expectation alignment",
        family_id: mustAt(createdFamilies, 0, "family").id,
        family_request_id: mustAt(createdFamilies, 0, "family").requestId,
        starts_at: plusDays(-2),
        ends_at: plusDays(-2 + 0.02),
        location: "Zoom",
        notes: "Family expects daily progress update",
        created_by_user_id: owner.id
      },
      {
        type: MeetingType.CANDIDATE_INTERVIEW,
        status: MeetingStatus.SCHEDULED,
        title: "Candidate interview round 2",
        candidate_id: mustAt(createdCandidates, 2, "candidate").id,
        family_request_id: mustAt(createdFamilies, 1, "family").requestId,
        starts_at: plusDays(1),
        ends_at: plusDays(1 + 0.03),
        location: "Office",
        notes: "Focus on newborn routines",
        created_by_user_id: owner.id
      },
      {
        type: MeetingType.FAMILY_CANDIDATE_MEETING,
        status: MeetingStatus.SCHEDULED,
        title: "Family-candidate introduction",
        family_id: mustAt(createdFamilies, 1, "family").id,
        candidate_id: mustAt(createdCandidates, 0, "candidate").id,
        family_request_id: mustAt(createdFamilies, 1, "family").requestId,
        starts_at: plusDays(2),
        ends_at: plusDays(2 + 0.04),
        location: "Family home",
        notes: "Bring translated CV summary",
        created_by_user_id: owner.id
      }
    ]
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Collect missing candidate document",
        description: "Request passport scan from Derya Akin",
        status: TaskStatus.IN_PROGRESS,
        priority: 5,
        due_at: plusDays(1),
        assignee_user_id: owner.id,
        entity_type: "CANDIDATE",
        entity_id: mustAt(createdCandidates, 3, "candidate").id,
        created_by_user_id: owner.id
      },
      {
        title: "Confirm trial day details",
        status: TaskStatus.TODO,
        priority: 4,
        due_at: plusDays(2),
        assignee_user_id: owner.id,
        entity_type: "FAMILY_REQUEST",
        entity_id: mustAt(createdFamilies, 0, "family").requestId,
        created_by_user_id: owner.id
      },
      {
        title: "Prepare weekly KPI summary",
        status: TaskStatus.TODO,
        priority: 3,
        due_at: plusDays(3),
        assignee_user_id: owner.id,
        entity_type: "REPORT",
        entity_id: "dashboard",
        created_by_user_id: owner.id
      }
    ]
  });

  await prisma.note.createMany({
    data: [
      {
        entity_type: "CANDIDATE",
        entity_id: mustAt(createdCandidates, 0, "candidate").id,
        content: "Candidate has very strong references and punctuality.",
        pinned: true,
        created_by_user_id: owner.id
      },
      {
        entity_type: "FAMILY",
        entity_id: mustAt(createdFamilies, 0, "family").id,
        content: "Family requests update every evening by 20:00.",
        pinned: false,
        created_by_user_id: owner.id
      },
      {
        entity_type: "FAMILY_REQUEST",
        entity_id: mustAt(createdFamilies, 1, "family").requestId,
        content: "Live-in option should include private room details.",
        pinned: false,
        created_by_user_id: owner.id
      }
    ]
  });

  const placement = await prisma.placement.create({
    data: {
      family_request_id: mustAt(createdFamilies, 0, "family").requestId,
      family_id: mustAt(createdFamilies, 0, "family").id,
      candidate_id: mustAt(createdCandidates, 0, "candidate").id,
      start_date: plusDays(7),
      agreed_salary: 39000,
      service_fee: 45000,
      status: PlacementStatus.ACTIVE,
      guarantee_until: plusDays(37),
      notes: "Demo active placement",
      created_by_user_id: owner.id
    },
    select: { id: true }
  });

  await prisma.placementStatusHistory.create({
    data: {
      placement_id: placement.id,
      old_status: PlacementStatus.ACCEPTED,
      new_status: PlacementStatus.ACTIVE,
      reason: "Trial completed",
      changed_by_user_id: owner.id
    }
  });

  const invoice = await prisma.invoice.create({
    data: {
      family_id: mustAt(createdFamilies, 0, "family").id,
      placement_id: placement.id,
      amount: 45000,
      due_date: plusDays(10),
      status: PaymentStatus.PENDING,
      notes: "Service fee invoice"
    },
    select: { id: true }
  });

  await prisma.payment.createMany({
    data: [
      {
        invoice_id: invoice.id,
        amount: 15000,
        currency: "TRY",
        paid_at: plusDays(-1),
        status: PaymentStatus.PAID,
        method: "Bank Transfer",
        transaction_ref: "DEMO-PMT-001"
      },
      {
        invoice_id: invoice.id,
        amount: 30000,
        currency: "TRY",
        status: PaymentStatus.PENDING,
        method: "Bank Transfer",
        transaction_ref: "DEMO-PMT-002"
      }
    ]
  });

  await prisma.contract.create({
    data: {
      placement_id: placement.id,
      family_id: mustAt(createdFamilies, 0, "family").id,
      candidate_id: mustAt(createdCandidates, 0, "candidate").id,
      status: ContractStatus.SIGNED,
      file_path: `/demo/contracts/${placement.id}.pdf`,
      sent_at: plusDays(-3),
      signed_at: plusDays(-1),
      created_by_user_id: owner.id
    }
  });

  await prisma.message.createMany({
    data: [
      {
        channel: "whatsapp",
        direction: "outbound",
        entity_type: "FAMILY_REQUEST",
        entity_id: mustAt(createdFamilies, 0, "family").requestId,
        to_value: "+905551100201",
        content: "Demo update: Candidate shortlist shared.",
        sent_at: plusDays(-1),
        created_by_user_id: owner.id
      },
      {
        channel: "email",
        direction: "outbound",
        entity_type: "CANDIDATE",
        entity_id: mustAt(createdCandidates, 0, "candidate").id,
        to_value: mustAt(createdCandidates, 0, "candidate").phone,
        subject: "Interview confirmation",
        content: "Your interview slot is confirmed for tomorrow.",
        sent_at: plusDays(-1),
        created_by_user_id: owner.id
      }
    ]
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actor_user_id: owner.id,
        action: "demo.seed.run",
        entity_type: "SYSTEM",
        entity_id: DEMO_SOURCE,
        metadata: { candidates: createdCandidates.length, families: createdFamilies.length }
      },
      {
        actor_user_id: owner.id,
        action: "shortlist.created",
        entity_type: "SHORTLIST",
        entity_id: primaryShortlist.id,
        metadata: { source: DEMO_SOURCE }
      }
    ]
  });

  await prisma.websiteSetting.createMany({
    data: [
      {
        key: "global.contact",
        group: "global",
        value: {
          phone: "",
          whatsapp: "",
          callbackLabel: "Geri arama talebi",
          supportEmail: "iletisim@dadikapida.com"
        } as Prisma.InputJsonValue
      },
      {
        key: "homepage.trust",
        group: "homepage",
        value: {
          items: ["Referans kontrolü", "Aileye özel eşleştirme", "Gizlilik ve KVKK", "Yerleştirme sonrası takip"]
        } as Prisma.InputJsonValue
      }
    ]
  });

  await prisma.websiteWhatsAppSetting.create({
    data: {
      is_enabled: true,
      default_phone: "",
      family_phone: "",
      candidate_phone: "",
      support_phone: "",
      default_message: "Merhaba, Dadı Kapıda üzerinden iletişime geçmek istiyorum.",
      family_message: "Merhaba, aile başvurusu için bilgi almak istiyorum.",
      candidate_message: "Merhaba, dadı başvurusu hakkında bilgi almak istiyorum.",
      out_of_hours_message: "Mesajınız alındı. Çalışma saatleri içinde dönüş yapacağız.",
      position: "bottom-right",
      show_on_mobile: true,
      show_on_desktop: true,
      active_hours: { start: "09:00", end: "18:00" } as Prisma.InputJsonValue,
      page_rules: { home: true, forms: true } as Prisma.InputJsonValue
    }
  });

  await prisma.websiteContent.createMany({
    data: [
      {
        type: WebsiteContentType.HOME,
        slug: "home",
        title: "Anasayfa",
        status: WebsiteContentStatus.PUBLISHED,
        hero_title: "Aileniz için güvenilir, referanslı ve ihtiyaçlarınıza uygun dadıyı birlikte bulalım.",
        hero_subtitle:
          "Yatılı veya gündüzlü dadı ihtiyacınızda; deneyim, referans, çalışma düzeni ve aile dinamiğinize göre adayları değerlendiriyoruz.",
        payload: {
          trustStatements: ["Referans kontrolü", "Aileye özel eşleştirme", "Gizlilik ve KVKK", "Yerleştirme sonrası takip"]
        } as Prisma.InputJsonValue,
        seo_title: "Dadı Kapıda | Profesyonel Dadı Yerleştirme Danışmanlığı",
        meta_description: "Profesyonel yatılı ve gündüzlü dadı yerleştirme danışmanlığı."
      },
      {
        type: WebsiteContentType.NAVIGATION,
        slug: "main",
        title: "Ana Menü",
        status: WebsiteContentStatus.PUBLISHED,
        payload: {
          items: [
            { label: "Aileler İçin", href: "/aileler-icin" },
            { label: "Hizmetlerimiz", href: "/hizmetlerimiz" },
            { label: "Blog", href: "/blog" },
            { label: "İletişim", href: "/iletisim" }
          ]
        } as Prisma.InputJsonValue
      },
      {
        type: WebsiteContentType.FAQ,
        slug: "aile-basvurusu-nasil-calisir",
        title: "Aile başvurusu nasıl çalışır?",
        status: WebsiteContentStatus.PUBLISHED,
        payload: {
          question: "Aile başvurusu nasıl çalışır?",
          answer: "Danışman görüşmesi sonrası uygun adaylar önerilir."
        } as Prisma.InputJsonValue
      },
      {
        type: WebsiteContentType.SERVICE,
        slug: "gunduzlu-dadi",
        title: "Gündüzlü Dadı",
        status: WebsiteContentStatus.PUBLISHED,
        payload: {
          summary: "Ev düzenine uyum sağlayan profesyonel gündüz desteği."
        } as Prisma.InputJsonValue
      },
      {
        type: WebsiteContentType.LOCATION,
        slug: "istanbul",
        title: "İstanbul",
        status: WebsiteContentStatus.PUBLISHED,
        payload: {
          summary: "İstanbul genelinde ailelere özel yerleştirme."
        } as Prisma.InputJsonValue
      },
      {
        type: WebsiteContentType.BLOG_POST,
        slug: "yatili-dadi-secerken-nelere-dikkat-edilmeli",
        title: "Yatılı dadı seçerken nelere dikkat edilmeli?",
        status: WebsiteContentStatus.PUBLISHED,
        payload: {
          excerpt: "Ailelerin karar verirken bakması gereken temel başlıklar."
        } as Prisma.InputJsonValue
      },
      {
        type: WebsiteContentType.BLOG_CATEGORY,
        slug: "dadi-secme-rehberi",
        title: "Dadı Seçme Rehberi",
        status: WebsiteContentStatus.PUBLISHED,
        payload: { description: "Aileler için rehber içerikler." } as Prisma.InputJsonValue
      }
    ]
  });

  console.log(`Demo seed completed: ${createdCandidates.length} candidates, ${createdFamilies.length} families.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
