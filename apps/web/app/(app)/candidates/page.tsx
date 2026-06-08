"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { candidateStatusLabels, positionLabels } from "@/lib/status-map";

type Candidate = {
  id: string;
  candidate_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  district: string | null;
  applied_position: string | null;
  status: string;
  created_at: string;
};

export default function CandidatesPage() {
  const [items, setItems] = useState<Candidate[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<Candidate[]>(`/candidates?page=1&limit=100`);
    setItems(data);
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Candidate[]>(`/candidates?page=1&limit=100`);
        if (mounted) {
          setItems(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Aday listesi alınamadı.");
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
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLocaleLowerCase("tr");
    if (!query) return items;

    return items.filter((candidate) =>
      `${candidate.first_name} ${candidate.last_name} ${candidate.phone} ${candidate.email ?? ""} ${candidate.applied_position ?? ""}`
        .toLocaleLowerCase("tr")
        .includes(query)
    );
  }, [items, q]);

  const remove = async (candidate: Candidate) => {
    const confirmed = window.confirm(
      `${candidate.first_name} ${candidate.last_name} adayını silmek istiyor musunuz?`
    );
    if (!confirmed) return;

    try {
      setError(null);
      await apiFetch(`/candidates/${candidate.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aday silinemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Personel Profilleri</h2>
        <Link href="/candidates/new" className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white">
          Yeni Personel
        </Link>
      </div>

      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Ad, telefon veya e-posta ile ara"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
                <tr>
                <th className="px-4 py-3">Kod</th>
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Pozisyon</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Lokasyon</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((candidate) => (
                <tr key={candidate.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">{candidate.candidate_code}</td>
                  <td className="px-4 py-3">
                    <Link href={`/candidates/${candidate.id}`} className="font-medium text-[var(--brand)]">
                      {candidate.first_name} {candidate.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{candidate.phone}</td>
                  <td className="px-4 py-3">
                    {candidate.applied_position
                      ? positionLabels[candidate.applied_position] ?? candidate.applied_position
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{candidate.email ?? "-"}</td>
                  <td className="px-4 py-3">
                    {candidate.city ?? "-"}
                    {candidate.district ? ` / ${candidate.district}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {candidateStatusLabels[candidate.status] ?? candidate.status}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => remove(candidate)}
                      className="rounded border border-red-200 px-2 py-1 text-xs text-red-700"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={8}>
                    Sonuç bulunamadı.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
