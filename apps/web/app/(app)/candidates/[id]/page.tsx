"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import {
  candidateStatusLabels,
  positionLabels,
  publicWorkTypeLabels,
  referenceStatusLabels,
  workTypeLabels
} from "@/lib/status-map";

type CandidatePlacement = {
  id: string;
  family_id: string;
  family_request_id: string;
  family_name: string | null;
  family_request_title: string | null;
  status: string;
  start_date: string;
  agreed_salary: string;
  service_fee: string | null;
  created_at: string;
};

type CandidateWorkPreference = {
  id: string;
  work_type: string;
  can_live_in: boolean;
  night_shift_ok: boolean;
  weekend_ok: boolean;
  min_salary: string | null;
  max_salary: string | null;
  created_at: string;
  updated_at: string;
};

type CandidateLanguage = {
  id: string;
  language_id: string;
  level: string | null;
  created_at: string;
  updated_at: string;
};

type CandidateExperience = {
  id: string;
  title: string | null;
  description: string | null;
  age_group_experience: string | null;
  years: number | null;
  start_date: string | null;
  end_date: string | null;
};

type CandidateReference = {
  id: string;
  full_name: string;
  phone: string | null;
  relation: string | null;
  status: string;
  created_at: string;
};

type CandidateDocument = {
  id: string;
  document_type: string;
  file_name: string;
  status: string;
  created_at: string;
};

type CandidateSourceApplication = {
  id: string;
  applied_position: string | null;
  notes: string | null;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
};

type LanguageOption = {
  id: string;
  name: string;
  code: string;
};

type Candidate = {
  id: string;
  candidate_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  birth_date: string | null;
  available_from: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  preferred_cities: string | null;
  applied_position: string | null;
  education_level: string | null;
  years_of_experience: number | null;
  expected_salary_min: string | null;
  expected_salary_max: string | null;
  smoking_status: string | null;
  has_first_aid_certificate: boolean;
  availability_status: string | null;
  status: string;
  source: string | null;
  created_at: string;
  placements: CandidatePlacement[];
  work_preferences: CandidateWorkPreference[];
  languages: CandidateLanguage[];
  experiences: CandidateExperience[];
  references: CandidateReference[];
  documents: CandidateDocument[];
  source_application: CandidateSourceApplication | null;
};

type ProfileDraft = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  birth_date: string;
  available_from: string;
  city: string;
  district: string;
  address: string;
  preferred_cities: string;
  applied_position: string;
  education_level: string;
  years_of_experience: string;
  expected_salary_min: string;
  expected_salary_max: string;
  smoking_status: string;
  has_first_aid_certificate: boolean;
  availability_status: string;
  status: string;
  source: string;
};

type WorkPreferenceDraft = {
  work_type: string;
  can_live_in: boolean;
  night_shift_ok: boolean;
  weekend_ok: boolean;
  min_salary: string;
  max_salary: string;
};

type LanguageDraft = {
  language_id: string;
  level: string;
};

type ExperienceDraft = {
  title: string;
  description: string;
  age_group_experience: string;
  years: string;
  start_date: string;
  end_date: string;
};

const statuses = [
  "NEW",
  "PRE_SCREEN",
  "INTERVIEW",
  "REFERENCE_CHECK",
  "DOCUMENT_PENDING",
  "APPROVED",
  "PASSIVE",
  "REJECTED",
  "BLACKLISTED"
] as const;

const availabilityOptions = ["", "Müsait", "1 Ay İçinde", "2 Hafta İçinde", "Pasif"];
const smokingOptions = ["", "Sigara Kullanmıyor", "Sigara Kullanıyor", "Belirtilmedi"];
const workTypeOptions = [
  { value: "", label: "Seçiniz" },
  { value: "LIVE_IN", label: "Yatılı" },
  { value: "DAYTIME", label: "Gündüzlü" },
  { value: "NIGHT", label: "Gece" },
  { value: "PART_TIME", label: "Yarı Zamanlı" },
  { value: "FULL_TIME", label: "Tam Zamanlı" }
] as const;

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("tr-TR");
}

function formatMoney(value: string | null | undefined) {
  if (!value) return "-";
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : new Intl.NumberFormat("tr-TR").format(numeric);
}

function payloadValue(payload: Record<string, unknown> | null, path: string[]): string | null {
  let current: unknown = payload;
  for (const key of path) {
    if (!current || typeof current !== "object" || Array.isArray(current)) return null;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" && current.trim() ? current : null;
}

function createProfileDraft(candidate: Candidate): ProfileDraft {
  return {
    first_name: candidate.first_name,
    last_name: candidate.last_name,
    phone: candidate.phone,
    email: candidate.email ?? "",
    birth_date: candidate.birth_date ? candidate.birth_date.slice(0, 10) : "",
    available_from: candidate.available_from ? candidate.available_from.slice(0, 10) : "",
    city: candidate.city ?? "",
    district: candidate.district ?? "",
    address: candidate.address ?? "",
    preferred_cities: candidate.preferred_cities ?? "",
    applied_position: candidate.applied_position
      ? positionLabels[candidate.applied_position] ?? candidate.applied_position
      : "",
    education_level: candidate.education_level ?? "",
    years_of_experience: candidate.years_of_experience?.toString() ?? "",
    expected_salary_min: candidate.expected_salary_min ?? "",
    expected_salary_max: candidate.expected_salary_max ?? "",
    smoking_status: candidate.smoking_status ?? "",
    has_first_aid_certificate: candidate.has_first_aid_certificate,
    availability_status: candidate.availability_status ?? "",
    status: candidate.status,
    source: candidate.source ?? ""
  };
}

export default function CandidateDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null);
  const [workPreferenceDraft, setWorkPreferenceDraft] = useState<WorkPreferenceDraft>({
    work_type: "",
    can_live_in: false,
    night_shift_ok: false,
    weekend_ok: false,
    min_salary: "",
    max_salary: ""
  });
  const [languageDraft, setLanguageDraft] = useState<LanguageDraft>({
    language_id: "",
    level: ""
  });
  const [experienceDraft, setExperienceDraft] = useState<ExperienceDraft>({
    title: "",
    description: "",
    age_group_experience: "",
    years: "",
    start_date: "",
    end_date: ""
  });
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, options] = await Promise.all([
          apiFetch<Candidate>(`/candidates/${params.id}`),
          apiFetch<LanguageOption[]>("/candidates/language-options")
        ]);

        if (!mounted) return;

        setCandidate(data);
        setProfileDraft(createProfileDraft(data));
        setLanguageOptions(options);
        if (data.work_preferences[0]) {
          const preference = data.work_preferences[0];
          setWorkPreferenceDraft({
            work_type: preference.work_type,
            can_live_in: preference.can_live_in,
            night_shift_ok: preference.night_shift_ok,
            weekend_ok: preference.weekend_ok,
            min_salary: preference.min_salary ?? "",
            max_salary: preference.max_salary ?? ""
          });
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Personel detay bilgisi alınamadı.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void run();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  const summary = useMemo(() => {
    if (!candidate) return null;
    return {
      registeredYear: new Date(candidate.created_at).getFullYear(),
      placementCount: candidate.placements.length,
      referenceCount: candidate.references.length,
      documentCount: candidate.documents.length,
      languageCount: candidate.languages.length,
      workPreferenceCount: candidate.work_preferences.length
    };
  }, [candidate]);

  const saveProfile = async () => {
    if (!candidate || !profileDraft) return;

    try {
      setSavingAction("profile");
      setError(null);
      const updated = await apiFetch<Candidate>(`/candidates/${candidate.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          first_name: profileDraft.first_name.trim(),
          last_name: profileDraft.last_name.trim(),
          phone: profileDraft.phone.trim(),
          email: profileDraft.email.trim() || undefined,
          birth_date: profileDraft.birth_date || undefined,
          available_from: profileDraft.available_from || undefined,
          city: profileDraft.city.trim() || undefined,
          district: profileDraft.district.trim() || undefined,
          address: profileDraft.address.trim() || undefined,
          preferred_cities: profileDraft.preferred_cities.trim() || undefined,
          applied_position: profileDraft.applied_position.trim() || undefined,
          education_level: profileDraft.education_level.trim() || undefined,
          years_of_experience: profileDraft.years_of_experience
            ? Number(profileDraft.years_of_experience)
            : undefined,
          expected_salary_min: profileDraft.expected_salary_min
            ? Number(profileDraft.expected_salary_min)
            : undefined,
          expected_salary_max: profileDraft.expected_salary_max
            ? Number(profileDraft.expected_salary_max)
            : undefined,
          smoking_status: profileDraft.smoking_status || undefined,
          has_first_aid_certificate: profileDraft.has_first_aid_certificate,
          availability_status: profileDraft.availability_status || undefined,
          status: profileDraft.status,
          source: profileDraft.source.trim() || undefined
        })
      });

      setCandidate((current) => (current ? { ...current, ...updated } : updated));
      setProfileDraft(createProfileDraft(updated));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil güncellenemedi.");
    } finally {
      setSavingAction(null);
    }
  };

  const addWorkPreference = async () => {
    if (!candidate || !workPreferenceDraft.work_type) return;

    try {
      setSavingAction("preference");
      setError(null);
      const created = await apiFetch<CandidateWorkPreference>(
        `/candidates/${candidate.id}/work-preferences`,
        {
          method: "POST",
          body: JSON.stringify({
            work_type: workPreferenceDraft.work_type,
            can_live_in: workPreferenceDraft.can_live_in,
            night_shift_ok: workPreferenceDraft.night_shift_ok,
            weekend_ok: workPreferenceDraft.weekend_ok,
            ...(workPreferenceDraft.min_salary ? { min_salary: Number(workPreferenceDraft.min_salary) } : {}),
            ...(workPreferenceDraft.max_salary ? { max_salary: Number(workPreferenceDraft.max_salary) } : {})
          })
        }
      );

      setCandidate((current) =>
        current
          ? { ...current, work_preferences: [created, ...current.work_preferences] }
          : current
      );
      setWorkPreferenceDraft({
        work_type: "",
        can_live_in: false,
        night_shift_ok: false,
        weekend_ok: false,
        min_salary: "",
        max_salary: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Çalışma tercihi eklenemedi.");
    } finally {
      setSavingAction(null);
    }
  };

  const deleteWorkPreference = async (id: string) => {
    if (!window.confirm("Bu çalışma tercihini silmek istiyor musunuz?")) return;

    try {
      setSavingAction(`delete-preference-${id}`);
      setError(null);
      await apiFetch(`/candidate-work-preferences/${id}`, { method: "DELETE" });
      setCandidate((current) =>
        current
          ? { ...current, work_preferences: current.work_preferences.filter((item) => item.id !== id) }
          : current
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Çalışma tercihi silinemedi.");
    } finally {
      setSavingAction(null);
    }
  };

  const addLanguage = async () => {
    if (!candidate || !languageDraft.language_id) return;

    try {
      setSavingAction("language");
      setError(null);
      const created = await apiFetch<CandidateLanguage>(`/candidates/${candidate.id}/languages`, {
        method: "POST",
        body: JSON.stringify({
          language_id: languageDraft.language_id,
          ...(languageDraft.level.trim() ? { level: languageDraft.level.trim() } : {})
        })
      });

      setCandidate((current) =>
        current ? { ...current, languages: [created, ...current.languages] } : current
      );
      setLanguageDraft({ language_id: "", level: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dil bilgisi eklenemedi.");
    } finally {
      setSavingAction(null);
    }
  };

  const addExperience = async () => {
    if (!candidate || !experienceDraft.title.trim() && !experienceDraft.age_group_experience.trim()) return;

    try {
      setSavingAction("experience");
      setError(null);
      const created = await apiFetch<CandidateExperience>(`/candidates/${candidate.id}/experiences`, {
        method: "POST",
        body: JSON.stringify({
          title: experienceDraft.title.trim() || undefined,
          description: experienceDraft.description.trim() || undefined,
          age_group_experience: experienceDraft.age_group_experience.trim() || undefined,
          ...(experienceDraft.years ? { years: Number(experienceDraft.years) } : {}),
          ...(experienceDraft.start_date ? { start_date: experienceDraft.start_date } : {}),
          ...(experienceDraft.end_date ? { end_date: experienceDraft.end_date } : {})
        })
      });

      setCandidate((current) =>
        current ? { ...current, experiences: [created, ...current.experiences] } : current
      );
      setExperienceDraft({
        title: "",
        description: "",
        age_group_experience: "",
        years: "",
        start_date: "",
        end_date: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deneyim kaydı eklenemedi.");
    } finally {
      setSavingAction(null);
    }
  };

  const deleteExperience = async (id: string) => {
    if (!window.confirm("Bu deneyim kaydını silmek istiyor musunuz?")) return;

    try {
      setSavingAction(`delete-experience-${id}`);
      setError(null);
      await apiFetch(`/candidate-experiences/${id}`, { method: "DELETE" });
      setCandidate((current) =>
        current ? { ...current, experiences: current.experiences.filter((item) => item.id !== id) } : current
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deneyim kaydı silinemedi.");
    } finally {
      setSavingAction(null);
    }
  };

  const deleteLanguage = async (id: string) => {
    if (!window.confirm("Bu dil kaydını silmek istiyor musunuz?")) return;

    try {
      setSavingAction(`delete-language-${id}`);
      setError(null);
      await apiFetch(`/candidate-languages/${id}`, { method: "DELETE" });
      setCandidate((current) =>
        current ? { ...current, languages: current.languages.filter((item) => item.id !== id) } : current
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dil kaydı silinemedi.");
    } finally {
      setSavingAction(null);
    }
  };

  const removeCandidate = async () => {
    if (!candidate) return;
    if (!window.confirm("Personeli silmek istediğinize emin misiniz?")) return;

    try {
      setSavingAction("remove");
      setError(null);
      await apiFetch<{ success: true }>(`/candidates/${candidate.id}`, {
        method: "DELETE"
      });
      router.push("/candidates");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Personel silinemedi.");
    } finally {
      setSavingAction(null);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  if (error && !candidate) return <p className="text-sm text-red-600">{error}</p>;
  if (!candidate || !profileDraft) return <p className="text-sm text-slate-600">Personel bulunamadı.</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Personel Kartı</p>
          <h2 className="mt-2 text-2xl font-bold">
            {candidate.first_name} {candidate.last_name}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {candidate.candidate_code} · {summary?.registeredYear} girişli
          </p>
        </div>
        <Link href="/candidates" className="text-sm text-[var(--brand)]">
          Listeye dön
        </Link>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Profil Özeti</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {candidate.first_name} {candidate.last_name}
          </p>
          <p className="mt-1 text-sm text-slate-600">{candidate.candidate_code}</p>
          <p className="mt-1 text-sm text-slate-600">
            {candidate.applied_position
              ? positionLabels[candidate.applied_position] ?? candidate.applied_position
              : "Pozisyon bilgisi yok"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Konum</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {[candidate.city, candidate.district].filter(Boolean).join(" / ") || "-"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {candidate.preferred_cities?.trim() || "Tercih edilen şehir bilgisi yok"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Durum</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {candidateStatusLabels[candidate.status] ?? candidate.status}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {candidate.availability_status ?? "Müsaitlik bilgisi yok"} · {candidate.has_first_aid_certificate ? "İlk yardım sertifikası var" : "İlk yardım sertifikası yok"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Operasyon</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {summary?.placementCount ?? 0} yerleştirme
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {summary?.referenceCount ?? 0} referans · {summary?.documentCount ?? 0} evrak · {summary?.languageCount ?? 0} dil
          </p>
        </div>
      </div>

      {candidate.source_application ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">İlk Web Başvurusu</h3>
          <p className="mt-1 text-sm text-slate-500">
            Personel profiline dönüştürülmeden önce adayın ilettiği bilgiler.
          </p>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              [
                "Başvurulan Pozisyon",
                candidate.source_application.applied_position
                  ? positionLabels[candidate.source_application.applied_position] ??
                    candidate.source_application.applied_position
                  : null
              ],
              [
                "Deneyim",
                payloadValue(candidate.source_application.raw_payload, ["experience", "years"])
              ],
              [
                "Çalışma Tipi",
                publicWorkTypeLabels[
                  payloadValue(candidate.source_application.raw_payload, ["experience", "workType"]) ?? ""
                ] ?? payloadValue(candidate.source_application.raw_payload, ["experience", "workType"])
              ],
              ["Adayın Notu", payloadValue(candidate.source_application.raw_payload, ["notes"])]
            ]
              .filter((row): row is [string, string] => Boolean(row[1]))
              .map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 text-sm text-slate-800">{value}</dd>
                </div>
              ))}
          </dl>
        </section>
      ) : null}

      <form
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void saveProfile();
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Temel Profil</p>
            <p className="text-xs text-[var(--muted)]">Kimlik, iletişim ve eşleşme için gerekli ana bilgiler.</p>
          </div>
          <button
            type="submit"
            disabled={savingAction === "profile"}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {savingAction === "profile" ? "Kaydediliyor..." : "Profili Kaydet"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Ad</span>
            <input
              value={profileDraft.first_name}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, first_name: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Soyad</span>
            <input
              value={profileDraft.last_name}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, last_name: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Telefon</span>
            <input
              value={profileDraft.phone}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, phone: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>E-posta</span>
            <input
              value={profileDraft.email}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, email: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Doğum Tarihi</span>
            <input
              type="date"
              value={profileDraft.birth_date}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, birth_date: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Müsait Olacağı Tarih</span>
            <input
              type="date"
              value={profileDraft.available_from}
              onChange={(event) =>
                setProfileDraft((current) => (current ? { ...current, available_from: event.target.value } : current))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Şehir</span>
            <input
              value={profileDraft.city}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, city: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>İlçe</span>
            <input
              value={profileDraft.district}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, district: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span>Adres</span>
            <textarea
              rows={3}
              value={profileDraft.address}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, address: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span>Çalışabileceği Şehirler</span>
            <input
              value={profileDraft.preferred_cities}
              onChange={(event) =>
                setProfileDraft((current) =>
                  current ? { ...current, preferred_cities: event.target.value } : current
                )
              }
              placeholder="İstanbul, Ankara, İzmir..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Başvurduğu Pozisyon</span>
            <input
              value={profileDraft.applied_position}
              onChange={(event) =>
                setProfileDraft((current) => (current ? { ...current, applied_position: event.target.value } : current))
              }
              placeholder="Dadı, şoför, aşçı..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Eğitim Bilgisi</span>
            <input
              value={profileDraft.education_level}
              onChange={(event) =>
                setProfileDraft((current) => (current ? { ...current, education_level: event.target.value } : current))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Deneyim Yılı</span>
            <input
              type="number"
              min={0}
              value={profileDraft.years_of_experience}
              onChange={(event) =>
                setProfileDraft((current) =>
                  current ? { ...current, years_of_experience: event.target.value } : current
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Maaş Alt Sınır</span>
            <input
              type="number"
              min={0}
              value={profileDraft.expected_salary_min}
              onChange={(event) =>
                setProfileDraft((current) =>
                  current ? { ...current, expected_salary_min: event.target.value } : current
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Maaş Üst Sınır</span>
            <input
              type="number"
              min={0}
              value={profileDraft.expected_salary_max}
              onChange={(event) =>
                setProfileDraft((current) =>
                  current ? { ...current, expected_salary_max: event.target.value } : current
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Müsaitlik</span>
            <select
              value={profileDraft.availability_status}
              onChange={(event) =>
                setProfileDraft((current) =>
                  current ? { ...current, availability_status: event.target.value } : current
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {availabilityOptions.map((option) => (
                <option key={option || "empty"} value={option}>
                  {option || "Seçiniz"}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Sigara Durumu</span>
            <select
              value={profileDraft.smoking_status}
              onChange={(event) =>
                setProfileDraft((current) =>
                  current ? { ...current, smoking_status: event.target.value } : current
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {smokingOptions.map((option) => (
                <option key={option || "empty"} value={option}>
                  {option || "Seçiniz"}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Durum</span>
            <select
              value={profileDraft.status}
              onChange={(event) =>
                setProfileDraft((current) => (current ? { ...current, status: event.target.value } : current))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {candidateStatusLabels[item] ?? item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Kaynak</span>
            <input
              value={profileDraft.source}
              onChange={(event) => setProfileDraft((current) => (current ? { ...current, source: event.target.value } : current))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              checked={profileDraft.has_first_aid_certificate}
              onChange={(event) =>
                setProfileDraft((current) =>
                  current ? { ...current, has_first_aid_certificate: event.target.checked } : current
                )
              }
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
            />
            <span>İlk yardım sertifikası var</span>
          </label>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Çalışma Tercihleri</p>
              <p className="text-xs text-[var(--muted)]">
                {summary?.workPreferenceCount ? `${summary.workPreferenceCount} kayıt` : "Henüz çalışma tercihi yok."}
              </p>
            </div>
            <button
              type="button"
              onClick={addWorkPreference}
              disabled={savingAction === "preference" || !workPreferenceDraft.work_type}
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {savingAction === "preference" ? "Ekleniyor..." : "Tercihi Ekle"}
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Çalışma Tipi</span>
              <select
                value={workPreferenceDraft.work_type}
                onChange={(event) =>
                  setWorkPreferenceDraft((current) => ({ ...current, work_type: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {workTypeOptions.map((option) => (
                  <option key={option.value || "empty"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span>Maaş Alt</span>
              <input
                type="number"
                min={0}
                value={workPreferenceDraft.min_salary}
                onChange={(event) =>
                  setWorkPreferenceDraft((current) => ({ ...current, min_salary: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span>Maaş Üst</span>
              <input
                type="number"
                min={0}
                value={workPreferenceDraft.max_salary}
                onChange={(event) =>
                  setWorkPreferenceDraft((current) => ({ ...current, max_salary: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                checked={workPreferenceDraft.can_live_in}
                onChange={(event) =>
                  setWorkPreferenceDraft((current) => ({ ...current, can_live_in: event.target.checked }))
                }
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>Yatılı çalışabilir</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                checked={workPreferenceDraft.night_shift_ok}
                onChange={(event) =>
                  setWorkPreferenceDraft((current) => ({ ...current, night_shift_ok: event.target.checked }))
                }
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>Gece vardiyası olur</span>
            </label>

            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input
                checked={workPreferenceDraft.weekend_ok}
                onChange={(event) =>
                  setWorkPreferenceDraft((current) => ({ ...current, weekend_ok: event.target.checked }))
                }
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>Hafta sonu çalışabilir</span>
            </label>
          </div>

          <div className="mt-5 space-y-3">
            {candidate.work_preferences.map((preference) => (
              <div
                key={preference.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
              >
                <div className="text-sm">
                  <p className="font-semibold">
                    {workTypeLabels[preference.work_type] ?? preference.work_type} ·{" "}
                    {preference.can_live_in ? "Yatılı" : "Gündüz"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    Maaş: {formatMoney(preference.min_salary)} - {formatMoney(preference.max_salary)} · Gece:{" "}
                    {preference.night_shift_ok ? "Evet" : "Hayır"} · Hafta sonu:{" "}
                    {preference.weekend_ok ? "Evet" : "Hayır"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void deleteWorkPreference(preference.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700"
                >
                  {savingAction === `delete-preference-${preference.id}` ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            ))}
            {candidate.work_preferences.length === 0 ? (
              <p className="text-sm text-slate-500">Bu personel için çalışma tercihi kaydı yok.</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Diller</p>
              <p className="text-xs text-[var(--muted)]">
                {summary?.languageCount ? `${summary.languageCount} kayıt` : "Henüz dil kaydı yok."}
              </p>
            </div>
            <button
              type="button"
              onClick={addLanguage}
              disabled={savingAction === "language" || !languageDraft.language_id}
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {savingAction === "language" ? "Ekleniyor..." : "Dil Ekle"}
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Dil</span>
              <select
                value={languageDraft.language_id}
                onChange={(event) =>
                  setLanguageDraft((current) => ({ ...current, language_id: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Seçiniz</option>
                {languageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} ({option.code})
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm md:col-span-2">
              <span>Seviye</span>
              <input
                value={languageDraft.level}
                onChange={(event) => setLanguageDraft((current) => ({ ...current, level: event.target.value }))}
                placeholder="Başlangıç, orta, ileri..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <div className="mt-5 space-y-3">
            {candidate.languages.map((language) => {
              const label = languageOptions.find((item) => item.id === language.language_id);
              return (
                <div
                  key={language.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <div className="text-sm">
                    <p className="font-semibold">{label ? `${label.name} (${label.code})` : language.language_id}</p>
                    <p className="text-xs text-[var(--muted)]">Seviye: {language.level ?? "-"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void deleteLanguage(language.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    {savingAction === `delete-language-${language.id}` ? "Siliniyor..." : "Sil"}
                  </button>
                </div>
              );
            })}
            {candidate.languages.length === 0 ? (
              <p className="text-sm text-slate-500">Bu personel için dil kaydı yok.</p>
            ) : null}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Deneyim Kayıtları</p>
            <p className="text-xs text-[var(--muted)]">
              {candidate.experiences.length ? `${candidate.experiences.length} kayıt` : "Henüz deneyim kaydı yok."}
            </p>
          </div>
          <button
            type="button"
            onClick={addExperience}
            disabled={savingAction === "experience"}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {savingAction === "experience" ? "Ekleniyor..." : "Deneyim Ekle"}
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Başlık</span>
            <input
              value={experienceDraft.title}
              onChange={(event) =>
                setExperienceDraft((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Bebek bakımı, yaşlı bakım, temizlik..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Yaş Grubu Deneyimi</span>
            <input
              value={experienceDraft.age_group_experience}
              onChange={(event) =>
                setExperienceDraft((current) => ({ ...current, age_group_experience: event.target.value }))
              }
              placeholder="0-2 yaş, okul çağı, yaşlı..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Yıl</span>
            <input
              type="number"
              min={0}
              value={experienceDraft.years}
              onChange={(event) =>
                setExperienceDraft((current) => ({ ...current, years: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Başlangıç Tarihi</span>
            <input
              type="date"
              value={experienceDraft.start_date}
              onChange={(event) =>
                setExperienceDraft((current) => ({ ...current, start_date: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Bitiş Tarihi</span>
            <input
              type="date"
              value={experienceDraft.end_date}
              onChange={(event) =>
                setExperienceDraft((current) => ({ ...current, end_date: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span>Açıklama</span>
            <textarea
              rows={3}
              value={experienceDraft.description}
              onChange={(event) =>
                setExperienceDraft((current) => ({ ...current, description: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-5 space-y-3">
          {candidate.experiences.map((experience) => (
            <div
              key={experience.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200 p-3"
            >
              <div className="text-sm">
                <p className="font-semibold">{experience.title ?? "Deneyim"}</p>
                <p className="text-xs text-[var(--muted)]">
                  Yaş grubu: {experience.age_group_experience ?? "-"} · Yıl: {experience.years ?? "-"}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                </p>
                {experience.description ? (
                  <p className="mt-2 text-sm text-slate-700">{experience.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => void deleteExperience(experience.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700"
              >
                {savingAction === `delete-experience-${experience.id}` ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold">Referanslar</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {summary?.referenceCount ? `${summary.referenceCount} kayıt` : "Henüz referans kaydı yok."}
          </p>
          <div className="mt-4 space-y-3">
            {candidate.references.map((reference) => (
              <div key={reference.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p className="font-semibold">{reference.full_name}</p>
                <p className="text-xs text-[var(--muted)]">
                  {reference.phone ?? "-"} · {reference.relation ?? "-"} ·{" "}
                  {referenceStatusLabels[reference.status] ?? reference.status}
                </p>
              </div>
            ))}
            {candidate.references.length === 0 ? (
              <p className="text-sm text-slate-500">Henüz referans kaydı yok.</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold">Evraklar</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {summary?.documentCount ? `${summary.documentCount} kayıt` : "Henüz evrak kaydı yok."}
          </p>
          <div className="mt-4 space-y-3">
            {candidate.documents.map((document) => (
              <div key={document.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p className="font-semibold">{document.document_type}</p>
                <p className="text-xs text-[var(--muted)]">
                  {document.file_name} · {document.status}
                </p>
              </div>
            ))}
            {candidate.documents.length === 0 ? (
              <p className="text-sm text-slate-500">Henüz evrak kaydı yok.</p>
            ) : null}
          </div>
        </section>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Yerleştirme Geçmişi</p>
            <p className="text-xs text-[var(--muted)]">
              {summary?.placementCount ? `${summary.placementCount} kayıt` : "Henüz yerleştirme yok."}
            </p>
          </div>
          <button
            type="button"
            onClick={removeCandidate}
            disabled={savingAction === "remove"}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-60"
          >
            {savingAction === "remove" ? "Siliniyor..." : "Personeli Sil"}
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Aile</th>
                <th className="px-4 py-3">Talep</th>
                <th className="px-4 py-3">Başlangıç</th>
                <th className="px-4 py-3">Maaş</th>
                <th className="px-4 py-3">Durum</th>
              </tr>
            </thead>
            <tbody>
              {candidate.placements.map((placement) => (
                <tr key={placement.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/families/${placement.family_id}`} className="font-medium text-[var(--brand)]">
                      {placement.family_name ?? placement.family_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/family-requests/${placement.family_request_id}`} className="font-medium text-[var(--brand)]">
                      {placement.family_request_title ?? placement.family_request_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{formatDate(placement.start_date)}</td>
                  <td className="px-4 py-3">{placement.agreed_salary}</td>
                  <td className="px-4 py-3">{placement.status}</td>
                </tr>
              ))}
              {candidate.placements.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={5}>
                    Bu personel için yerleştirme kaydı yok.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
