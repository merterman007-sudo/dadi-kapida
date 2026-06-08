"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import {
  applicationStatusLabels,
  positionLabels,
  publicWorkTypeLabels,
  workTypeLabels
} from "@/lib/status-map";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  district: string | null;
  applied_position: string | null;
  birth_date: string | null;
  experience_years: number | null;
  work_type_preference: string | null;
  notes: string | null;
  raw_payload: Record<string, unknown> | null;
  status: string;
};

const statuses = ["NEW", "CONTACTED", "CONVERTED_TO_CANDIDATE", "REJECTED", "DUPLICATE"] as const;

function payloadValue(payload: Record<string, unknown>, path: string[]): string | null {
  let current: unknown = payload;
  for (const key of path) {
    if (!current || typeof current !== "object" || Array.isArray(current)) return null;
    current = (current as Record<string, unknown>)[key];
  }
  if (typeof current === "string" && current.trim()) return current;
  if (typeof current === "number" || typeof current === "boolean") return String(current);
  return null;
}

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Application | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Application>(`/applications/${params.id}`);
        if (mounted) {
          setItem(data);
          setStatus(data.status);
          setNotes(data.notes ?? "");
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Başvuru detayı alınamadı.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  const save = async () => {
    if (!item) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await apiFetch<Application>(`/applications/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes })
      });
      setItem(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvuru güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  const convert = async () => {
    if (!item) return;
    try {
      setSaving(true);
      setError(null);
      const result = await apiFetch<{ candidate: { id: string } }>(`/applications/${item.id}/convert-to-candidate`, {
        method: "POST"
      });
      router.push(`/candidates/${result.candidate.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dönüştürme başarısız.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  if (error && !item) return <p className="text-sm text-red-600">{error}</p>;
  if (!item) return <p className="text-sm text-slate-600">Başvuru bulunamadı.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {item.first_name} {item.last_name}
        </h2>
        <Link href="/applications" className="text-sm text-[var(--brand)]">
          Listeye dön
        </Link>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <p className="text-sm">
          <strong>Telefon:</strong> {item.phone}
        </p>
        <p className="text-sm">
          <strong>E-posta:</strong> {item.email ?? "-"}
        </p>
        <p className="text-sm">
          <strong>Şehir:</strong> {item.city ?? "-"}
        </p>
        <p className="text-sm">
          <strong>İlçe:</strong> {item.district ?? "-"}
        </p>
        <p className="text-sm md:col-span-2">
          <strong>Başvurduğu Pozisyon:</strong>{" "}
          {item.applied_position
            ? positionLabels[item.applied_position] ?? item.applied_position
            : "-"}
        </p>
        <p className="text-sm">
          <strong>Doğum Tarihi:</strong>{" "}
          {item.birth_date ? new Date(item.birth_date).toLocaleDateString("tr-TR") : "-"}
        </p>
        <p className="text-sm">
          <strong>Deneyim:</strong>{" "}
          {item.experience_years !== null ? `${item.experience_years} yıl` : "-"}
        </p>
        <p className="text-sm md:col-span-2">
          <strong>Çalışma Tercihi:</strong>{" "}
          {item.work_type_preference
            ? workTypeLabels[item.work_type_preference] ?? item.work_type_preference
            : "-"}
        </p>

        <label className="space-y-1 text-sm md:col-span-2">
          <span>Durum</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {applicationStatusLabels[value] ?? value}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm md:col-span-2">
          <span>Notlar</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={convert}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
          >
            Adaya Dönüştür
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      {item.raw_payload ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">Web Başvuru Formu Bilgileri</h3>
          <p className="mt-1 text-sm text-slate-500">
            Başvuru sırasında iletilen ek bilgiler.
          </p>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              ["Başvurulan Pozisyon", payloadValue(item.raw_payload, ["application", "appliedPosition"])],
              ["Deneyim", payloadValue(item.raw_payload, ["experience", "years"])],
              [
                "Çalışma Tipi",
                publicWorkTypeLabels[payloadValue(item.raw_payload, ["experience", "workType"]) ?? ""] ??
                  payloadValue(item.raw_payload, ["experience", "workType"])
              ],
              ["Adayın Notu", payloadValue(item.raw_payload, ["notes"])]
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
    </div>
  );
}
