import {
  CandidateStatus,
  FamilyRequestStatus,
  FamilyRequest,
  MatchStatus,
  Prisma
} from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

type ScoreBreakdown = {
  location: number;
  salary: number;
  experience: number;
  childAgeExperience: number;
  workType: number;
  availability: number;
  reference: number;
  interview: number;
  document: number;
  certification: number;
  smoking: number;
  language: number;
};

type MatchingWeights = Record<keyof ScoreBreakdown, number>;

const DEFAULT_WEIGHTS: MatchingWeights = {
  location: 0.15,
  salary: 0.12,
  experience: 0.12,
  childAgeExperience: 0.1,
  workType: 0.1,
  availability: 0.08,
  reference: 0.1,
  interview: 0.06,
  document: 0.07,
  certification: 0.04,
  smoking: 0.03,
  language: 0.03
};

@Injectable()
export class MatchingService {
  constructor(private readonly prisma: PrismaService) {}

  async runForFamilyRequest(familyRequestId: string, actorUserId?: string) {
    const familyRequest = await this.prisma.familyRequest.findUnique({
      where: { id: familyRequestId }
    });
    if (!familyRequest) {
      throw new NotFoundException("Family request not found");
    }

    const weights = this.resolveWeights(familyRequest.match_weights_json);
    const candidates = await this.prisma.candidate.findMany({
      where: {
        deleted_at: null,
        is_placeable: true,
        status: { not: CandidateStatus.BLACKLISTED }
      }
    });

    const candidateIds = candidates.map((candidate) => candidate.id);
    const [preferences, experiences, candidateLanguages, languages] = await Promise.all([
      candidateIds.length > 0
        ? this.prisma.candidateWorkPreference.findMany({
            where: { candidate_id: { in: candidateIds } }
          })
        : Promise.resolve([]),
      candidateIds.length > 0
        ? this.prisma.candidateExperience.findMany({
            where: { candidate_id: { in: candidateIds } }
          })
        : Promise.resolve([]),
      candidateIds.length > 0
        ? this.prisma.candidateLanguage.findMany({
            where: { candidate_id: { in: candidateIds } }
          })
        : Promise.resolve([]),
      this.prisma.language.findMany()
    ]);

    const preferencesByCandidate = new Map<string, typeof preferences>();
    for (const preference of preferences) {
      const list = preferencesByCandidate.get(preference.candidate_id) ?? [];
      list.push(preference);
      preferencesByCandidate.set(preference.candidate_id, list);
    }

    const experiencesByCandidate = new Map<string, typeof experiences>();
    for (const experience of experiences) {
      const list = experiencesByCandidate.get(experience.candidate_id) ?? [];
      list.push(experience);
      experiencesByCandidate.set(experience.candidate_id, list);
    }

    const languagesByCandidate = new Map<string, typeof candidateLanguages>();
    for (const candidateLanguage of candidateLanguages) {
      const list = languagesByCandidate.get(candidateLanguage.candidate_id) ?? [];
      list.push(candidateLanguage);
      languagesByCandidate.set(candidateLanguage.candidate_id, list);
    }

    const languageMap = new Map<string, { name: string; code: string }>();
    for (const language of languages) {
      languageMap.set(language.id, { name: language.name.toLowerCase(), code: language.code.toLowerCase() });
    }

    const run = await this.prisma.matchRun.create({
      data: {
        family_request_id: familyRequestId,
        run_by_user_id: actorUserId,
        weights_json: weights as Prisma.InputJsonValue,
        filters_json: {
          generatedAt: new Date().toISOString()
        } as Prisma.InputJsonValue
      }
    });

    const matches: Prisma.CandidateMatchCreateManyInput[] = [];

    for (const candidate of candidates) {
      const candidatePreferences = preferencesByCandidate.get(candidate.id) ?? [];
      const candidateExperiences = experiencesByCandidate.get(candidate.id) ?? [];
      const candidateLanguageRows = languagesByCandidate.get(candidate.id) ?? [];

      const hardFilterResult = this.applyHardFilters(
        candidate,
        familyRequest,
        candidatePreferences
      );
      if (!hardFilterResult.allowed) {
        continue;
      }

      const breakdown = this.computeBreakdown({
        candidate,
        familyRequest,
        preferences: candidatePreferences,
        experiences: candidateExperiences,
        candidateLanguages: candidateLanguageRows,
        languageMap
      });
      const totalScore = this.computeTotalScore(breakdown, weights);
      const explanation = this.buildExplanation(breakdown, hardFilterResult.redFlags);

      matches.push({
        match_run_id: run.id,
        family_request_id: familyRequestId,
        candidate_id: candidate.id,
        status: MatchStatus.SUGGESTED,
        total_score: totalScore,
        location_score: breakdown.location,
        salary_score: breakdown.salary,
        experience_score: breakdown.experience,
        child_age_experience_score: breakdown.childAgeExperience,
        work_type_score: breakdown.workType,
        availability_score: breakdown.availability,
        reference_score: breakdown.reference,
        interview_score: breakdown.interview,
        document_score: breakdown.document,
        certification_score: breakdown.certification,
        smoking_score: breakdown.smoking,
        language_score: breakdown.language,
        explanation_json: explanation as Prisma.InputJsonValue
      });
    }

    matches.sort((a, b) => Number(b.total_score) - Number(a.total_score));

    await this.prisma.$transaction([
      this.prisma.candidateMatch.createMany({ data: matches }),
      this.prisma.matchRun.update({
        where: { id: run.id },
        data: { result_count: matches.length }
      }),
      this.prisma.familyRequest.update({
        where: { id: familyRequestId },
        data: { status: FamilyRequestStatus.MATCHING }
      })
    ]);

    const topResults = await this.prisma.candidateMatch.findMany({
      where: { match_run_id: run.id },
      orderBy: { total_score: "desc" },
      take: 25
    });

    return { run: { ...run, result_count: matches.length }, results: topResults };
  }

  async getRun(runId: string) {
    const run = await this.prisma.matchRun.findUnique({
      where: { id: runId }
    });
    if (!run) {
      throw new NotFoundException("Match run not found");
    }

    return run;
  }

  async getLatestRunForFamilyRequest(familyRequestId: string) {
    const familyRequest = await this.prisma.familyRequest.findUnique({
      where: { id: familyRequestId },
      select: { id: true }
    });
    if (!familyRequest) {
      throw new NotFoundException("Family request not found");
    }

    const run = await this.prisma.matchRun.findFirst({
      where: { family_request_id: familyRequestId },
      orderBy: { created_at: "desc" }
    });

    if (!run) {
      return { run: null, results: [] };
    }

    const results = await this.prisma.candidateMatch.findMany({
      where: { match_run_id: run.id },
      orderBy: { total_score: "desc" }
    });

    return { run, results };
  }

  async getRunResults(runId: string) {
    await this.getRun(runId);
    return this.prisma.candidateMatch.findMany({
      where: { match_run_id: runId },
      orderBy: { total_score: "desc" }
    });
  }

  async getCandidateMatch(id: string) {
    const match = await this.prisma.candidateMatch.findUnique({
      where: { id }
    });
    if (!match) {
      throw new NotFoundException("Candidate match not found");
    }

    return match;
  }

  async updateCandidateMatchStatus(id: string, status: MatchStatus) {
    await this.getCandidateMatch(id);
    return this.prisma.candidateMatch.update({
      where: { id },
      data: { status }
    });
  }

  private applyHardFilters(
    candidate: {
      status: CandidateStatus;
      years_of_experience: number | null;
    },
    request: FamilyRequest,
    preferences: Array<{
      can_live_in: boolean;
    }>
  ) {
    const redFlags: string[] = [];

    if (request.work_type === "LIVE_IN") {
      const hasLiveInPreference = preferences.some((preference) => preference.can_live_in);
      if (!hasLiveInPreference) {
        return {
          allowed: false,
          redFlags: ["Talep yatılı, adayın yatılı tercihi bulunmuyor."]
        };
      }
    }

    if (
      typeof request.min_experience_years === "number" &&
      typeof candidate.years_of_experience === "number" &&
      request.min_experience_years - candidate.years_of_experience >= 5
    ) {
      redFlags.push("Deneyim açığı yüksek.");
    }

    if (candidate.status !== CandidateStatus.APPROVED) {
      redFlags.push("Aday henüz APPROVED durumunda değil.");
    }

    return { allowed: true, redFlags };
  }

  private computeBreakdown(input: {
    candidate: {
      city: string | null;
      district: string | null;
      expected_salary_min: Prisma.Decimal | null;
      expected_salary_max: Prisma.Decimal | null;
      years_of_experience: number | null;
      availability_status: string | null;
      reference_score: number | null;
      interview_score: number | null;
      document_score: number | null;
      has_first_aid_certificate: boolean;
      smoking_status: string | null;
      status: CandidateStatus;
    };
    familyRequest: FamilyRequest;
    preferences: Array<{
      work_type: FamilyRequest["work_type"];
      can_live_in: boolean;
    }>;
    experiences: Array<{
      age_group_experience: string | null;
    }>;
    candidateLanguages: Array<{
      language_id: string;
      level: string | null;
    }>;
    languageMap: Map<string, { name: string; code: string }>;
  }): ScoreBreakdown {
    const {
      candidate,
      familyRequest,
      preferences,
      experiences,
      candidateLanguages,
      languageMap
    } = input;

    const location = this.computeLocationScore(
      candidate.city,
      candidate.district,
      familyRequest.city,
      familyRequest.district
    );
    const salary = this.computeSalaryScore(
      candidate.expected_salary_min,
      candidate.expected_salary_max,
      familyRequest.salary_min,
      familyRequest.salary_max
    );
    const experience = this.computeExperienceScore(
      candidate.years_of_experience,
      familyRequest.min_experience_years
    );
    const childAgeExperience = this.computeChildAgeExperienceScore(
      experiences,
      familyRequest.child_age_groups
    );
    const workType = this.computeWorkTypeScore(preferences, familyRequest.work_type);
    const availability = this.computeAvailabilityScore(candidate.availability_status);
    const reference = this.normalizeScore(candidate.reference_score ?? 0);
    const interview = this.normalizeScore(candidate.interview_score ?? 0);
    const document = this.normalizeScore(candidate.document_score ?? 0);
    const certification = this.computeCertificationScore(
      candidate.has_first_aid_certificate,
      familyRequest.requires_first_aid
    );
    const smoking = this.computeSmokingScore(
      candidate.smoking_status,
      familyRequest.requires_non_smoker
    );
    const language = this.computeLanguageScore(
      familyRequest.required_language,
      familyRequest.required_language_level,
      candidateLanguages,
      languageMap
    );

    const approvalBonus = candidate.status === CandidateStatus.APPROVED ? 5 : -10;

    return {
      location,
      salary,
      experience: this.normalizeScore(experience + approvalBonus),
      childAgeExperience,
      workType,
      availability,
      reference,
      interview,
      document,
      certification,
      smoking,
      language
    };
  }

  private computeLocationScore(
    candidateCity: string | null,
    candidateDistrict: string | null,
    requestCity: string | null,
    requestDistrict: string | null
  ): number {
    if (!requestCity) {
      return 70;
    }
    if (!candidateCity) {
      return 30;
    }
    if (candidateCity.toLowerCase() !== requestCity.toLowerCase()) {
      return 20;
    }
    if (!requestDistrict || !candidateDistrict) {
      return 80;
    }
    return candidateDistrict.toLowerCase() === requestDistrict.toLowerCase() ? 100 : 65;
  }

  private computeSalaryScore(
    candidateMin: Prisma.Decimal | null,
    candidateMax: Prisma.Decimal | null,
    requestMin: Prisma.Decimal | null,
    requestMax: Prisma.Decimal | null
  ): number {
    if (!requestMin && !requestMax) {
      return 70;
    }

    const reqMin = requestMin ? Number(requestMin) : 0;
    const reqMax = requestMax ? Number(requestMax) : Number.MAX_SAFE_INTEGER;
    const candMin = candidateMin ? Number(candidateMin) : reqMin;
    const candMax = candidateMax ? Number(candidateMax) : candMin;

    if (candMin <= reqMax && candMax >= reqMin) {
      return 100;
    }

    const distance = candMin > reqMax ? candMin - reqMax : reqMin - candMax;
    const penalty = Math.min(80, Math.round(distance / 500));
    return this.normalizeScore(80 - penalty);
  }

  private computeExperienceScore(
    candidateYears: number | null,
    requiredYears: number | null
  ): number {
    if (!requiredYears || requiredYears <= 0) {
      return 70;
    }
    if (!candidateYears || candidateYears <= 0) {
      return 20;
    }
    if (candidateYears >= requiredYears) {
      const bonus = Math.min(15, (candidateYears - requiredYears) * 3);
      return this.normalizeScore(85 + bonus);
    }

    const gap = requiredYears - candidateYears;
    return this.normalizeScore(80 - gap * 15);
  }

  private computeChildAgeExperienceScore(
    experiences: Array<{ age_group_experience: string | null }>,
    requestChildAgeGroups: string | null
  ): number {
    if (!requestChildAgeGroups) {
      return 70;
    }
    const requested = requestChildAgeGroups.toLowerCase();
    const hasMatch = experiences.some((experience) =>
      (experience.age_group_experience ?? "").toLowerCase().includes(requested)
    );
    return hasMatch ? 95 : 45;
  }

  private computeWorkTypeScore(
    preferences: Array<{ work_type: FamilyRequest["work_type"]; can_live_in: boolean }>,
    requestWorkType: FamilyRequest["work_type"]
  ): number {
    if (!requestWorkType) {
      return 70;
    }
    if (preferences.length === 0) {
      return 40;
    }

    const exactMatch = preferences.some(
      (preference) => preference.work_type === requestWorkType
    );
    if (exactMatch) {
      return 100;
    }

    if (requestWorkType === "LIVE_IN") {
      const canLiveIn = preferences.some((preference) => preference.can_live_in);
      return canLiveIn ? 80 : 0;
    }

    return 35;
  }

  private computeAvailabilityScore(availabilityStatus: string | null): number {
    if (!availabilityStatus) {
      return 60;
    }

    const normalized = availabilityStatus.toLowerCase();
    if (
      normalized.includes("available") ||
      normalized.includes("müsait") ||
      normalized.includes("musait")
    ) {
      return 95;
    }
    if (normalized.includes("soon") || normalized.includes("yakında")) {
      return 70;
    }
    return 35;
  }

  private computeCertificationScore(
    hasFirstAid: boolean,
    requestRequiresFirstAid: boolean
  ): number {
    if (!requestRequiresFirstAid) {
      return hasFirstAid ? 90 : 60;
    }
    return hasFirstAid ? 100 : 10;
  }

  private computeSmokingScore(
    candidateSmokingStatus: string | null,
    requiresNonSmoker: boolean
  ): number {
    const smoker = this.isSmoker(candidateSmokingStatus);
    if (!requiresNonSmoker) {
      return smoker ? 55 : 85;
    }
    return smoker ? 0 : 100;
  }

  private computeLanguageScore(
    requiredLanguage: string | null,
    _requiredLanguageLevel: string | null,
    candidateLanguages: Array<{ language_id: string; level: string | null }>,
    languageMap: Map<string, { name: string; code: string }>
  ): number {
    if (!requiredLanguage) {
      return 70;
    }

    const normalizedRequired = requiredLanguage.toLowerCase();
    const hasLanguage = candidateLanguages.some((row) => {
      const lookup = languageMap.get(row.language_id);
      if (!lookup) {
        return false;
      }
      return (
        lookup.name.includes(normalizedRequired) ||
        lookup.code === normalizedRequired
      );
    });

    if (!hasLanguage) {
      return 20;
    }

    const strongLevel = candidateLanguages.some((row) =>
      ["advanced", "fluent", "c1", "c2", "ileri"].includes(
        (row.level ?? "").toLowerCase()
      )
    );
    return strongLevel ? 95 : 80;
  }

  private computeTotalScore(breakdown: ScoreBreakdown, weights: MatchingWeights): number {
    const total =
      breakdown.location * weights.location +
      breakdown.salary * weights.salary +
      breakdown.experience * weights.experience +
      breakdown.childAgeExperience * weights.childAgeExperience +
      breakdown.workType * weights.workType +
      breakdown.availability * weights.availability +
      breakdown.reference * weights.reference +
      breakdown.interview * weights.interview +
      breakdown.document * weights.document +
      breakdown.certification * weights.certification +
      breakdown.smoking * weights.smoking +
      breakdown.language * weights.language;

    return Number(total.toFixed(2));
  }

  private buildExplanation(breakdown: ScoreBreakdown, redFlags: string[]) {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    const entries: Array<[keyof ScoreBreakdown, string]> = [
      ["location", "Lokasyon uyumu"],
      ["salary", "Maaş aralığı uyumu"],
      ["experience", "Deneyim seviyesi"],
      ["childAgeExperience", "Yaş grubu deneyimi"],
      ["workType", "Çalışma tipi uyumu"],
      ["availability", "Uygunluk durumu"],
      ["reference", "Referans kalitesi"],
      ["interview", "Mülakat kalitesi"],
      ["document", "Evrak yeterliliği"],
      ["certification", "Sertifika uyumu"],
      ["smoking", "Sigara kriteri"],
      ["language", "Dil uyumu"]
    ];

    for (const [key, label] of entries) {
      const value = breakdown[key];
      if (value >= 80) {
        strengths.push(label);
      } else if (value <= 40) {
        weaknesses.push(label);
      }
    }

    const summary =
      strengths.length >= weaknesses.length
        ? "Aday talep için güçlü bir eşleşme profili gösteriyor."
        : "Aday eşleşmesinde dikkat edilmesi gereken alanlar bulunuyor.";

    return {
      summary,
      strengths,
      weaknesses,
      redFlags,
      scoreBreakdown: breakdown
    };
  }

  private resolveWeights(rawWeights: Prisma.JsonValue | null): MatchingWeights {
    if (!rawWeights || typeof rawWeights !== "object" || Array.isArray(rawWeights)) {
      return DEFAULT_WEIGHTS;
    }

    const keys = Object.keys(DEFAULT_WEIGHTS) as Array<keyof ScoreBreakdown>;
    const next: MatchingWeights = { ...DEFAULT_WEIGHTS };
    let total = 0;

    for (const key of keys) {
      const value = (rawWeights as Record<string, unknown>)[key];
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        next[key] = value;
      }
      total += next[key];
    }

    if (total <= 0) {
      return DEFAULT_WEIGHTS;
    }

    const normalized: MatchingWeights = { ...next };
    for (const key of keys) {
      normalized[key] = Number((next[key] / total).toFixed(4));
    }
    return normalized;
  }

  private normalizeScore(value: number): number {
    if (Number.isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  private isSmoker(smokingStatus: string | null): boolean {
    const normalized = (smokingStatus ?? "").toLowerCase();
    return (
      normalized.includes("smoker") ||
      normalized.includes("sigara") ||
      normalized.includes("içiyor") ||
      normalized.includes("iciyor")
    );
  }
}
