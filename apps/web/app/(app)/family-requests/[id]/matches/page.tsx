"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type CandidateMatch = {
  id: string;
  candidate_id: string;
  total_score: number;
  location_score: number | null;
  salary_score: number | null;
  experience_score: number | null;
  reference_score: number | null;
  document_score: number | null;
  status: string;
};

type Candidate = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string | null;
  district: string | null;
  status: string;
};

type MatchRun = {
  id: string;
  created_at: string;
  result_count: number;
};

type MatchResponse = {
  run: MatchRun | null;
  results: CandidateMatch[];
};

type Shortlist = {
  id: string;
  title: string;
};

function scoreClass(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 55) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function FamilyRequestMatchesPage() {
  const params = useParams<{ id: string }>();
  const familyRequestId = params.id;

  const [run, setRun] = useState<MatchRun | null>(null);
  const [results, setResults] = useState<CandidateMatch[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [selectedShortlistId, setSelectedShortlistId] = useState("");
  const [newShortlistTitle, setNewShortlistTitle] = useState("Ön Değerlendirme");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [creatingShortlist, setCreatingShortlist] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [matches, shortlistRows, candidateRows] = await Promise.all([
      apiFetch<MatchResponse>(`/family-requests/${familyRequestId}/matches`),
      apiFetch<Shortlist[]>(`/shortlists?family_request_id=${familyRequestId}&page=1&limit=100`),
      apiFetch<Candidate[]>("/candidates?page=1&limit=100")
    ]);

    setRun(matches.run);
    setResults(matches.results);
    setShortlists(shortlistRows);
    setCandidates(candidateRows);
    setSelectedShortlistId((current) => current || shortlistRows[0]?.id || "");
  };

  useEffect(() => {
    let mounted = true;

    const runLoad = async () => {
      try {
        setLoading(true);
        setError(null);
        await load();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Eşleşmeler alınamadı.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void runLoad();

    return () => {
      mounted = false;
    };
  }, [familyRequestId]);

  const candidateMap = useMemo(
    () => new Map(candidates.map((candidate) => [candidate.id, candidate])),
    [candidates]
  );

  const runMatching = async () => {
    try {
      setRunning(true);
      setError(null);
      const response = await apiFetch<MatchResponse>(
        `/family-requests/${familyRequestId}/run-matching`,
        { method: "POST" }
      );
      setRun(response.run);
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eşleştirme çalıştırılamadı.");
    } finally {
      setRunning(false);
    }
  };

  const createShortlist = async () => {
    if (!newShortlistTitle.trim()) {
      setError("Kısa liste başlığı gerekli.");
      return;
    }

    try {
      setCreatingShortlist(true);
      setError(null);
      const created = await apiFetch<Shortlist>("/shortlists", {
        method: "POST",
        body: JSON.stringify({
          family_request_id: familyRequestId,
          title: newShortlistTitle.trim()
        })
      });
      const next = [created, ...shortlists];
      setShortlists(next);
      setSelectedShortlistId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kısa liste oluşturulamadı.");
    } finally {
      setCreatingShortlist(false);
    }
  };

  const addCandidateToShortlist = async (candidateId: string) => {
    if (!selectedShortlistId) {
      setError("Önce bir kısa liste seçin.");
      return;
    }

    try {
      setError(null);
      await apiFetch(`/shortlists/${selectedShortlistId}/items`, {
        method: "POST",
        body: JSON.stringify({ candidate_id: candidateId })
      });

      setResults((current) =>
        current.map((item) =>
          item.candidate_id === candidateId ? { ...item, status: "SHORTLISTED" } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aday kısa listeye eklenemedi.");
    }
  };

  const sortedResults = useMemo(
    () => [...results].sort((a, b) => b.total_score - a.total_score),
    [results]
  );

  if (loading) {
    return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Akıllı Eşleştirme</p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">Önerilen Adaylar</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Sistem lokasyon, maaş, deneyim, referans ve evrak skorlarını tartarak talebe en uygun adayları sıralar.
            </p>
          </div>
          <button
            type="button"
            onClick={runMatching}
            disabled={running}
            className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {running ? "Çalıştırılıyor..." : "Eşleştirmeyi Çalıştır"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Yeni Kısa Liste Başlığı</span>
          <input
            value={newShortlistTitle}
            onChange={(event) => setNewShortlistTitle(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={createShortlist}
            disabled={creatingShortlist}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"
          >
            {creatingShortlist ? "Oluşturuluyor..." : "Kısa Liste Oluştur"}
          </button>
        </div>

        <label className="space-y-1 text-sm md:col-span-3">
          <span>Eklemek için Kısa Liste</span>
          <select
            value={selectedShortlistId}
            onChange={(event) => setSelectedShortlistId(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Seçiniz</option>
            {shortlists.map((shortlist) => (
              <option key={shortlist.id} value={shortlist.id}>
                {shortlist.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {run ? (
        <p className="text-xs text-slate-500">
          Son çalışma: {new Date(run.created_at).toLocaleString("tr-TR")} · {run.result_count} sonuç
        </p>
      ) : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-3">
        {sortedResults.map((item) => {
          const candidate = candidateMap.get(item.candidate_id);

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {candidate ? `${candidate.first_name} ${candidate.last_name}` : item.candidate_id.slice(0, 8)}
                    </h3>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${scoreClass(item.total_score)}`}>
                      {item.total_score} puan
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{item.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {candidate
                      ? `${candidate.phone} · ${[candidate.city, candidate.district].filter(Boolean).join(" / ") || "Lokasyon yok"} · ${candidate.status}`
                      : "Aday detayı yüklenemedi"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/candidates/${item.candidate_id}`}
                    className="rounded border border-slate-300 px-3 py-2 text-xs"
                  >
                    Profil
                  </Link>
                  <button
                    type="button"
                    onClick={() => addCandidateToShortlist(item.candidate_id)}
                    disabled={item.status === "SHORTLISTED"}
                    className="rounded border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 disabled:opacity-60"
                  >
                    {item.status === "SHORTLISTED" ? "Kısa Listede" : "Kısa Listeye Ekle"}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-5">
                {[
                  ["Lokasyon", item.location_score],
                  ["Maaş", item.salary_score],
                  ["Deneyim", item.experience_score],
                  ["Referans", item.reference_score],
                  ["Evrak", item.document_score]
                ].map(([label, score]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-lg font-bold">{score ?? "-"}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
        {sortedResults.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Sonuç yok. Eşleştirmeyi çalıştırın.
          </div>
        ) : null}
      </div>
    </div>
  );
}
