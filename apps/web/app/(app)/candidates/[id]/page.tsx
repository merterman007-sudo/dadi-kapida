"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

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

type Candidate = {
  id: string;
  candidate_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  district: string | null;
  years_of_experience: number | null;
  status: string;
  source: string | null;
  created_at: string;
  placements: CandidatePlacement[];
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("tr-TR");
}

export default function CandidateDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Candidate>(`/candidates/${params.id}`);
        if (mounted) {
          setCandidate(data);
          setStatus(data.status);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Aday detay bilgisi alınamadı.");
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
    if (!candidate) {
      return null;
    }

    return {
      registeredYear: new Date(candidate.created_at).getFullYear(),
      placementCount: candidate.placements.length
    };
  }, [candidate]);

  const saveStatus = async () => {
    if (!candidate) return;

    try {
      setSaving(true);
      setError(null);
      const updated = await apiFetch<Omit<Candidate, "placements">>(`/candidates/${candidate.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setCandidate((current) => (current ? { ...current, ...updated } : ({ ...updated, placements: [] } as Candidate)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Durum güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  const removeCandidate = async () => {
    if (!candidate) return;
    if (!window.confirm("Adayı silmek istediğinize emin misiniz?")) return;

    try {
      setSaving(true);
      setError(null);
      await apiFetch<{ success: true }>(`/candidates/${candidate.id}`, {
        method: "DELETE"
      });
      router.push("/candidates");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aday silinemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!candidate) return <p className="text-sm text-slate-600">Aday bulunamadı.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Aday Kartı</p>
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

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <p className="text-sm">
          <strong>Kalıcı Kod:</strong> {candidate.candidate_code}
        </p>
        <p className="text-sm">
          <strong>Telefon:</strong> {candidate.phone}
        </p>
        <p className="text-sm">
          <strong>E-posta:</strong> {candidate.email ?? "-"}
        </p>
        <p className="text-sm">
          <strong>Şehir:</strong> {candidate.city ?? "-"}
        </p>
        <p className="text-sm">
          <strong>İlçe:</strong> {candidate.district ?? "-"}
        </p>
        <p className="text-sm">
          <strong>Deneyim:</strong> {candidate.years_of_experience ?? "-"}
        </p>
        <p className="text-sm">
          <strong>Kaynak:</strong> {candidate.source ?? "-"}
        </p>
        <p className="text-sm">
          <strong>İlk Kayıt:</strong> {formatDate(candidate.created_at)}
        </p>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium">Durum</label>
          <div className="flex flex-wrap items-center gap-3">
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
            <button
              type="button"
              onClick={saveStatus}
              disabled={saving}
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Durumu Güncelle"}
            </button>
            <button
              type="button"
              onClick={removeCandidate}
              disabled={saving}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-60"
            >
              Adayı Sil
            </button>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Yerleştirme Geçmişi</p>
            <p className="text-xs text-[var(--muted)]">
              {summary?.placementCount ? `${summary.placementCount} kayıt` : "Henüz yerleştirme yok."}
            </p>
          </div>
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
                    Bu aday için yerleştirme kaydı yok.
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
