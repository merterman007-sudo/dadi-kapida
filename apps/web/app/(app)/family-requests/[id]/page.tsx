"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { familyRequestStatusLabels } from "@/lib/status-map";

type FamilyRequest = {
  id: string;
  family_id: string;
  title: string;
  status: string;
  priority: number | null;
  city: string | null;
  district: string | null;
  description: string | null;
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

export default function FamilyRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<FamilyRequest | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<FamilyRequest>(`/family-requests/${params.id}`);
        if (mounted) {
          setItem(data);
          setTitle(data.title);
          setStatus(data.status);
          setPriority(data.priority?.toString() ?? "");
          setDescription(data.description ?? "");
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Talep detayı alınamadı.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void run();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  const save = async () => {
    if (!item) return;
    try {
      setSaving(true);
      setError(null);
      const payload: Record<string, unknown> = {
        title,
        status,
        description
      };
      if (priority.trim()) {
        payload.priority = Number(priority);
      }

      const updated = await apiFetch<FamilyRequest>(`/family-requests/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      setItem(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Talep güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!item || !window.confirm("Bu aile talebini silmek istediğinize emin misiniz?")) return;
    try {
      setSaving(true);
      setError(null);
      await apiFetch(`/family-requests/${item.id}`, { method: "DELETE" });
      router.push("/family-requests");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aile talebi silinemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!item) return <p className="text-sm text-slate-600">Talep bulunamadı.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{item.title}</h2>
        <div className="flex items-center gap-3">
          <Link
            href={`/family-requests/${item.id}/matches`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium"
          >
            Eşleşmeler
          </Link>
          <Link href="/family-requests" className="text-sm text-[var(--brand)]">
            Listeye dön
          </Link>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <p className="text-sm md:col-span-2">
          <strong>Aile ID:</strong> {item.family_id}
        </p>

        <label className="space-y-1 text-sm md:col-span-2">
          <span>Başlık</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Durum</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {familyRequestStatusLabels[value] ?? value}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span>Öncelik</span>
          <input
            type="number"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <p className="text-sm">
          <strong>Şehir:</strong> {item.city ?? "-"}
        </p>
        <p className="text-sm">
          <strong>İlçe:</strong> {item.district ?? "-"}
        </p>

        <label className="space-y-1 text-sm md:col-span-2">
          <span>Açıklama</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="md:col-span-2 flex items-center gap-3">
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
            onClick={remove}
            disabled={saving}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
          >
            Sil
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
