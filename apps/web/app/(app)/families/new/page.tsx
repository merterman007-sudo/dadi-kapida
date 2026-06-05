"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api-client";

type CreateFamilyPayload = {
  family_name: string;
  primary_contact_name: string;
  primary_contact_phone: string;
  primary_contact_email?: string;
  city?: string;
  district?: string;
  address?: string;
  notes?: string;
};

type Family = {
  id: string;
};

export default function FamilyCreatePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (formData: FormData) => {
    const family_name = String(formData.get("family_name") ?? "").trim();
    const primary_contact_name = String(formData.get("primary_contact_name") ?? "").trim();
    const primary_contact_phone = String(formData.get("primary_contact_phone") ?? "").trim();
    const primary_contact_email = String(formData.get("primary_contact_email") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const district = String(formData.get("district") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    if (!family_name || !primary_contact_name || !primary_contact_phone) {
      setError("Aile adı, birincil iletişim adı ve telefon zorunludur.");
      return;
    }

    const payload: CreateFamilyPayload = {
      family_name,
      primary_contact_name,
      primary_contact_phone,
      ...(primary_contact_email ? { primary_contact_email } : {}),
      ...(city ? { city } : {}),
      ...(district ? { district } : {}),
      ...(address ? { address } : {}),
      ...(notes ? { notes } : {})
    };

    try {
      setSubmitting(true);
      setError(null);
      const created = await apiFetch<Family>("/families", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      router.push(`/families/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aile oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Aileler / Yeni</h2>

      <form action={onSubmit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Aile Adı *</span>
          <input name="family_name" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Birincil İletişim *</span>
          <input name="primary_contact_name" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Birincil Telefon *</span>
          <input name="primary_contact_phone" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Birincil E-posta</span>
          <input name="primary_contact_email" type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
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
          <input name="address" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm md:col-span-2">
          <span>Notlar</span>
          <textarea name="notes" rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Kaydediliyor..." : "Aileyi Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/families")}
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
