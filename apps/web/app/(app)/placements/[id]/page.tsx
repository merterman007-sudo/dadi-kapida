"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Placement = {
  id: string;
  family_request_id: string;
  family_id: string;
  candidate_id: string;
  start_date: string;
  agreed_salary: string;
  status: string;
  notes: string | null;
};

const statuses = [
  "OFFERED",
  "ACCEPTED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "TERMINATED",
  "REPLACEMENT"
] as const;

const statusLabels: Record<(typeof statuses)[number], string> = {
  OFFERED: "Teklif Edildi",
  ACCEPTED: "Kabul Edildi",
  ACTIVE: "Aktif",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi",
  TERMINATED: "Sonlandırıldı",
  REPLACEMENT: "Değişim Sürecinde"
};

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Placement | null>(null);
  const [status, setStatus] = useState<(typeof statuses)[number]>("ACTIVE");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<Placement>(`/placements/${params.id}`);
    setItem(data);
    setStatus(data.status as (typeof statuses)[number]);
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Placement>(`/placements/${params.id}`);
        if (mounted) {
          setItem(data);
          setStatus(data.status as (typeof statuses)[number]);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Yerleştirme alınamadı.");
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

  const updateStatus = async () => {
    if (!item) return;
    try {
      setSaving(true);
      setError(null);
      await apiFetch(`/placements/${item.id}/status`, {
        method: "POST",
        body: JSON.stringify({ status, reason })
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Durum güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!item || !window.confirm("Bu yerleştirmeyi silmek istediğinize emin misiniz?")) return;
    try {
      setSaving(true);
      setError(null);
      await apiFetch(`/placements/${item.id}`, { method: "DELETE" });
      router.push("/placements");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yerleştirme silinemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!item) return <p className="text-sm text-slate-600">Yerleştirme bulunamadı.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Yerleştirme Detayı</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm space-y-2">
        <p><strong>Aile Talebi:</strong>{" "}
          <Link href={`/family-requests/${item.family_request_id}`} className="text-[var(--brand)] hover:underline underline-offset-2">
            Talep sayfasına git
          </Link>
        </p>
        <p><strong>Aile:</strong>{" "}
          <Link href={`/families/${item.family_id}`} className="text-[var(--brand)] hover:underline underline-offset-2">
            Aile sayfasına git
          </Link>
        </p>
        <p><strong>Personel:</strong>{" "}
          <Link href={`/candidates/${item.candidate_id}`} className="text-[var(--brand)] hover:underline underline-offset-2">
            Personel sayfasına git
          </Link>
        </p>
        <p><strong>Başlangıç:</strong> {new Date(item.start_date).toLocaleDateString("tr-TR")}</p>
        <p><strong>Maaş:</strong> {item.agreed_salary}</p>
        <p><strong>Durum:</strong> {statusLabels[item.status as (typeof statuses)[number]] ?? item.status}</p>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {statuses.map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Durum nedeni"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
        />
      </div>
      <button
        type="button"
        onClick={updateStatus}
        disabled={saving}
        className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        Durumu Güncelle
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={saving}
        className="ml-3 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
      >
        Sil
      </button>
    </div>
  );
}
