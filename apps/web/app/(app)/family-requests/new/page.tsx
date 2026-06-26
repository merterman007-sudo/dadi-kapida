"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { familyRequestStatusLabels } from "@/lib/status-map";

type Family = {
  id: string;
  family_name: string;
};

type FamilyRequest = {
  id: string;
};

type Payload = {
  family_id: string;
  title: string;
  priority?: number;
  city?: string;
  district?: string;
  description?: string;
  status?: string;
};

const statuses = [
  "DRAFT",
  "OPEN",
  "MATCHING",
  "SHORTLISTED",
  "INTERVIEWING",
  "OFFER",
  "PLACED",
  "CANCELLED",
  "LOST"
] as const;

export default function FamilyRequestCreatePage() {
  const router = useRouter();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loadingFamilies, setLoadingFamilies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const data = await apiFetch<Family[]>("/families?page=1&limit=200");
        if (mounted) setFamilies(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Aile listesi alınamadı.");
      } finally {
        if (mounted) setLoadingFamilies(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (formData: FormData) => {
    const family_id = String(formData.get("family_id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const district = String(formData.get("district") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const priorityText = String(formData.get("priority") ?? "").trim();

    if (!family_id || !title) {
      setError("Aile ve başlık zorunludur.");
      return;
    }

    const payload: Payload = {
      family_id,
      title,
      ...(status ? { status } : {}),
      ...(city ? { city } : {}),
      ...(district ? { district } : {}),
      ...(description ? { description } : {}),
      ...(priorityText ? { priority: Number(priorityText) } : {})
    };

    try {
      setSubmitting(true);
      setError(null);
      const created = await apiFetch<FamilyRequest>("/family-requests", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      router.push(`/family-requests/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Talep oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Aile Talepleri / Yeni</h2>

      <form action={onSubmit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Aile *</span>
          <select
            name="family_id"
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            disabled={loadingFamilies}
          >
            <option value="" disabled>
              {loadingFamilies ? "Aileler yükleniyor..." : "Aile seçin"}
            </option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.family_name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm md:col-span-2">
          <span>Başlık *</span>
          <input name="title" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Durum</span>
          <select name="status" defaultValue="DRAFT" className="w-full rounded-lg border border-slate-300 px-3 py-2">
            {statuses.map((item) => (
              <option key={item} value={item}>
                {familyRequestStatusLabels[item] ?? item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span>Öncelik</span>
          <input name="priority" type="number" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
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
          <span>Açıklama</span>
          <textarea name="description" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || loadingFamilies}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Kaydediliyor..." : "Talebi Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/family-requests")}
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
