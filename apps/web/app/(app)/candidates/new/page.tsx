"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api-client";

type CreateCandidatePayload = {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  city?: string;
  district?: string;
  years_of_experience?: number;
  source?: string;
};

type Candidate = {
  id: string;
};

export default function CandidateCreatePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (formData: FormData) => {
    const first_name = String(formData.get("first_name") ?? "").trim();
    const last_name = String(formData.get("last_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const district = String(formData.get("district") ?? "").trim();
    const source = String(formData.get("source") ?? "").trim();
    const years = String(formData.get("years_of_experience") ?? "").trim();

    if (!first_name || !last_name || !phone) {
      setError("Ad, soyad ve telefon zorunludur.");
      return;
    }

    const payload: CreateCandidatePayload = {
      first_name,
      last_name,
      phone,
      ...(email ? { email } : {}),
      ...(city ? { city } : {}),
      ...(district ? { district } : {}),
      ...(source ? { source } : {}),
      ...(years ? { years_of_experience: Number(years) } : {})
    };

    try {
      setSubmitting(true);
      setError(null);
      const created = await apiFetch<Candidate>("/candidates", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      router.push(`/candidates/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aday oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Adaylar / Yeni</h2>

      <form action={onSubmit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
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
          <span>Şehir</span>
          <input name="city" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>İlçe</span>
          <input name="district" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Deneyim Yılı</span>
          <input name="years_of_experience" type="number" min={0} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Kaynak</span>
          <input name="source" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Kaydediliyor..." : "Adayı Kaydet"}
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
