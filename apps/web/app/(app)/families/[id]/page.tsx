"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Family = {
  id: string;
  family_name: string;
  primary_contact_name: string;
  primary_contact_phone: string;
  primary_contact_email: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  notes: string | null;
  status: string;
};

const statuses = ["LEAD", "QUALIFIED", "ACTIVE", "PASSIVE", "BLACKLISTED"] as const;

export default function FamilyDetailPage() {
  const params = useParams<{ id: string }>();
  const [family, setFamily] = useState<Family | null>(null);
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
        const data = await apiFetch<Family>(`/families/${params.id}`);
        if (mounted) {
          setFamily(data);
          setStatus(data.status);
          setNotes(data.notes ?? "");
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Aile detayı alınamadı.");
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
    if (!family) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await apiFetch<Family>(`/families/${family.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes })
      });
      setFamily(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aile güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!family) return <p className="text-sm text-slate-600">Aile bulunamadı.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{family.family_name}</h2>
        <Link href="/families" className="text-sm text-[var(--brand)]">
          Listeye dön
        </Link>
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <p className="text-sm">
          <strong>Birincil İletişim:</strong> {family.primary_contact_name}
        </p>
        <p className="text-sm">
          <strong>Telefon:</strong> {family.primary_contact_phone}
        </p>
        <p className="text-sm">
          <strong>E-posta:</strong> {family.primary_contact_email ?? "-"}
        </p>
        <p className="text-sm">
          <strong>Lokasyon:</strong> {family.city ?? "-"}
          {family.district ? ` / ${family.district}` : ""}
        </p>
        <p className="text-sm md:col-span-2">
          <strong>Adres:</strong> {family.address ?? "-"}
        </p>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium">Durum</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="min-w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <label className="space-y-1 text-sm md:col-span-2">
          <span>Notlar</span>
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
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
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
