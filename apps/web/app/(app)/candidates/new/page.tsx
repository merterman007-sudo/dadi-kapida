"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api-client";

type CreateCandidatePayload = {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  birth_date?: string;
  city?: string;
  district?: string;
  address?: string;
  preferred_cities?: string;
  education_level?: string;
  years_of_experience?: number;
  expected_salary_min?: number;
  expected_salary_max?: number;
  status?: string;
  source?: string;
  has_first_aid_certificate?: boolean;
  availability_status?: string;
  smoking_status?: string;
};

type CreateWorkPreferencePayload = {
  work_type: string;
  can_live_in?: boolean;
  night_shift_ok?: boolean;
  weekend_ok?: boolean;
  min_salary?: number;
  max_salary?: number;
};

type Candidate = {
  id: string;
};

const availabilityOptions = [
  "",
  "Müsait",
  "1 Ay İçinde",
  "2 Hafta İçinde",
  "Pasif"
];

const smokingOptions = ["", "Sigara Kullanmıyor", "Sigara Kullanıyor", "Belirtilmedi"];

const workTypeOptions = [
  { value: "", label: "Seçiniz" },
  { value: "LIVE_IN", label: "Yatılı" },
  { value: "DAYTIME", label: "Gündüzlü" },
  { value: "NIGHT", label: "Gece" },
  { value: "PART_TIME", label: "Yarı Zamanlı" },
  { value: "FULL_TIME", label: "Tam Zamanlı" }
];

export default function CandidateCreatePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (formData: FormData) => {
    const first_name = String(formData.get("first_name") ?? "").trim();
    const last_name = String(formData.get("last_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const birth_date = String(formData.get("birth_date") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const district = String(formData.get("district") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const preferred_cities = String(formData.get("preferred_cities") ?? "").trim();
    const education_level = String(formData.get("education_level") ?? "").trim();
    const source = String(formData.get("source") ?? "").trim();
    const years = String(formData.get("years_of_experience") ?? "").trim();
    const salaryMin = String(formData.get("expected_salary_min") ?? "").trim();
    const salaryMax = String(formData.get("expected_salary_max") ?? "").trim();
    const availability_status = String(formData.get("availability_status") ?? "").trim();
    const smoking_status = String(formData.get("smoking_status") ?? "").trim();
    const work_type_preference = String(formData.get("work_type_preference") ?? "").trim();
    const work_min_salary = String(formData.get("work_min_salary") ?? "").trim();
    const work_max_salary = String(formData.get("work_max_salary") ?? "").trim();

    if (!first_name || !last_name || !phone) {
      setError("Ad, soyad ve telefon zorunludur.");
      return;
    }

    const payload: CreateCandidatePayload = {
      first_name,
      last_name,
      phone,
      ...(email ? { email } : {}),
      ...(birth_date ? { birth_date } : {}),
      ...(city ? { city } : {}),
      ...(district ? { district } : {}),
      ...(address ? { address } : {}),
      ...(preferred_cities ? { preferred_cities } : {}),
      ...(education_level ? { education_level } : {}),
      ...(source ? { source } : {}),
      ...(years ? { years_of_experience: Number(years) } : {}),
      ...(salaryMin ? { expected_salary_min: Number(salaryMin) } : {}),
      ...(salaryMax ? { expected_salary_max: Number(salaryMax) } : {}),
      ...(availability_status ? { availability_status } : {}),
      ...(smoking_status ? { smoking_status } : {}),
      has_first_aid_certificate: formData.get("has_first_aid_certificate") === "on"
    };

    const preferencePayload: CreateWorkPreferencePayload | null = work_type_preference
      ? {
          work_type: work_type_preference,
          can_live_in: formData.get("can_live_in") === "on",
          night_shift_ok: formData.get("night_shift_ok") === "on",
          weekend_ok: formData.get("weekend_ok") === "on",
          ...(work_min_salary ? { min_salary: Number(work_min_salary) } : {}),
          ...(work_max_salary ? { max_salary: Number(work_max_salary) } : {})
        }
      : null;

    try {
      setSubmitting(true);
      setError(null);
      const created = await apiFetch<Candidate>("/candidates", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (preferencePayload) {
        await apiFetch(`/candidates/${created.id}/work-preferences`, {
          method: "POST",
          body: JSON.stringify(preferencePayload)
        });
      }

      router.push(`/candidates/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Personel oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Personel Profilleri</p>
        <h2 className="mt-2 text-2xl font-bold">Yeni Personel Kaydı</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Temel profil, çalışma tercihi ve iletişim bilgilerini burada topluyoruz. Fotoğrafı sonraya bırakıyoruz.
        </p>
      </div>

      <form action={onSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-4">
        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Ad *</span>
            <input name="first_name" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Soyad *</span>
            <input name="last_name" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Telefon *</span>
            <input name="phone" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>E-posta</span>
            <input name="email" type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Doğum Tarihi</span>
            <input name="birth_date" type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Şehir</span>
            <input name="city" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>İlçe</span>
            <input name="district" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span>Adres</span>
            <textarea
              name="address"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span>Çalışabileceği Şehirler</span>
            <input
              name="preferred_cities"
              placeholder="İstanbul, Ankara, İzmir gibi virgülle ayırın"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Eğitim Bilgisi</span>
            <input name="education_level" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Deneyim Yılı</span>
            <input
              name="years_of_experience"
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Maaş Alt Sınır</span>
            <input
              name="expected_salary_min"
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Maaş Üst Sınır</span>
            <input
              name="expected_salary_max"
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Müsaitlik</span>
            <select name="availability_status" className="w-full rounded-lg border border-slate-300 px-3 py-2">
              {availabilityOptions.map((option) => (
                <option key={option || "empty"} value={option}>
                  {option || "Seçiniz"}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Sigara Durumu</span>
            <select name="smoking_status" className="w-full rounded-lg border border-slate-300 px-3 py-2">
              {smokingOptions.map((option) => (
                <option key={option || "empty"} value={option}>
                  {option || "Seçiniz"}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span>Kaynak</span>
            <input name="source" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input name="has_first_aid_certificate" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            <span>İlk yardım sertifikası var</span>
          </label>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-sm font-semibold">Çalışma Tercihi</p>
            <p className="text-xs text-[var(--muted)]">İlk kayıt sırasında temel eşleşme bilgisini de alalım.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>Çalışma Tipi</span>
              <select name="work_type_preference" className="w-full rounded-lg border border-slate-300 px-3 py-2">
                {workTypeOptions.map((option) => (
                  <option key={option.value || "empty"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span>Tercih Edilen Maaş Alt Sınır</span>
              <input
                name="work_min_salary"
                type="number"
                min={0}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span>Tercih Edilen Maaş Üst Sınır</span>
              <input
                name="work_max_salary"
                type="number"
                min={0}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-2">
                <input name="can_live_in" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                <span>Yatılı çalışabilir</span>
              </label>
              <label className="flex items-center gap-2">
                <input name="night_shift_ok" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                <span>Gece vardiyasına uygun</span>
              </label>
              <label className="flex items-center gap-2">
                <input name="weekend_ok" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                <span>Hafta sonu çalışabilir</span>
              </label>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Kaydediliyor..." : "Personeli Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/candidates")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
          >
            Vazgeç
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </form>
    </div>
  );
}
