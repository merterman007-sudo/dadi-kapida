"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import {
  familyRequestStatusLabels,
  familyStatusLabels,
  workTypeLabels
} from "@/lib/status-map";

type FamilyMember = {
  id: string;
  full_name: string;
  relation: string | null;
  birth_date: string | null;
  notes: string | null;
};

type FamilyRequest = {
  id: string;
  title: string;
  status: string;
  work_type: string | null;
  start_date: string | null;
  salary_min: string | null;
  salary_max: string | null;
  children_count: number | null;
  city: string | null;
  district: string | null;
  description: string | null;
  requirements_json: Record<string, unknown> | null;
};

type Family = {
  id: string;
  family_name: string;
  primary_contact_name: string;
  primary_contact_phone: string;
  primary_contact_email: string | null;
  secondary_contact_name: string | null;
  secondary_contact_phone: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  budget_min: string | null;
  budget_max: string | null;
  source: string | null;
  notes: string | null;
  status: string;
  members: FamilyMember[];
  requests: FamilyRequest[];
};

const statuses = ["LEAD", "QUALIFIED", "ACTIVE", "PASSIVE", "BLACKLISTED"] as const;

function formatMoney(value: string | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0
  }).format(Number(value));
}

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
        if (mounted) {
          setError(err instanceof Error ? err.message : "Aile detayı alınamadı.");
        }
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
    if (!family) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await apiFetch<Family>(`/families/${family.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes })
      });
      setFamily((current) => (current ? { ...current, ...updated } : updated));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aile güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  if (error && !family) return <p className="text-sm text-red-600">{error}</p>;
  if (!family) return <p className="text-sm text-slate-600">Aile bulunamadı.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Aile Kartı</p>
          <h2 className="mt-1 text-2xl font-bold">{family.family_name}</h2>
        </div>
        <Link href="/families" className="text-sm text-[var(--brand)]">
          Listeye dön
        </Link>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
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
          <strong>Konum:</strong> {[family.city, family.district].filter(Boolean).join(" / ") || "-"}
        </p>
        <p className="text-sm">
          <strong>İkinci İletişim:</strong> {family.secondary_contact_name ?? "-"}
        </p>
        <p className="text-sm">
          <strong>İkinci Telefon:</strong> {family.secondary_contact_phone ?? "-"}
        </p>
        <p className="text-sm">
          <strong>Bütçe:</strong> {formatMoney(family.budget_min)} - {formatMoney(family.budget_max)}
        </p>
        <p className="text-sm">
          <strong>Kaynak:</strong> {family.source === "WEBSITE" ? "Web Sitesi" : family.source ?? "-"}
        </p>
        <p className="text-sm md:col-span-2">
          <strong>Adres:</strong> {family.address ?? "-"}
        </p>

        <label className="space-y-1 text-sm">
          <span>Durum</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {familyStatusLabels[item] ?? item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm md:col-span-2">
          <span>Notlar</span>
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="w-fit rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Aile Üyeleri</h3>
        <p className="mt-1 text-sm text-slate-500">
          Bu aileye bağlı kişi kayıtları.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {family.members.map((member) => (
            <article key={member.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium">{member.full_name}</p>
              <p className="mt-1 text-sm text-slate-600">
                {member.relation ?? "Yakınlık belirtilmedi"}
                {member.birth_date
                  ? ` · ${new Date(member.birth_date).toLocaleDateString("tr-TR")}`
                  : ""}
              </p>
              {member.notes ? <p className="mt-2 text-sm text-slate-600">{member.notes}</p> : null}
            </article>
          ))}
          {family.members.length === 0 ? (
            <p className="text-sm text-slate-500">Henüz aile üyesi kaydı yok.</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Aile Talepleri</h3>
        <p className="mt-1 text-sm text-slate-500">
          Web başvurusu ve sonradan açılan ihtiyaç kayıtları.
        </p>
        <div className="mt-4 space-y-3">
          {family.requests.map((request) => (
            <article key={request.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/family-requests/${request.id}`}
                    className="font-semibold text-[var(--brand)]"
                  >
                    {request.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">
                    {familyRequestStatusLabels[request.status] ?? request.status}
                    {request.work_type
                      ? ` · ${workTypeLabels[request.work_type] ?? request.work_type}`
                      : ""}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                  {request.start_date
                    ? new Date(request.start_date).toLocaleDateString("tr-TR")
                    : "Başlangıç tarihi yok"}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                <p><strong>Konum:</strong> {[request.city, request.district].filter(Boolean).join(" / ") || "-"}</p>
                <p><strong>Çocuk Sayısı:</strong> {request.children_count ?? "-"}</p>
                <p><strong>Maaş:</strong> {formatMoney(request.salary_min)} - {formatMoney(request.salary_max)}</p>
              </div>
              {request.description ? (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  {request.description}
                </p>
              ) : null}
            </article>
          ))}
          {family.requests.length === 0 ? (
            <p className="text-sm text-slate-500">Bu aile için talep kaydı yok.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
