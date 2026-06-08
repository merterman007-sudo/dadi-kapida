"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { referenceStatusLabels } from "@/lib/status-map";

type CandidateOption = {
  id: string;
  candidate_code: string;
  first_name: string;
  last_name: string;
  phone: string;
};

type ReferenceRow = {
  id: string;
  full_name: string;
  phone: string | null;
  relation: string | null;
  status: string;
};

type ReferenceCheck = {
  id: string;
  status: string;
  score: number | null;
  notes: string | null;
  created_at: string;
};

const checkStatuses = ["VERIFIED", "CONTACTED", "NEGATIVE", "UNREACHABLE"] as const;

export default function ReferencesPage() {
  const [candidates, setCandidates] = useState<CandidateOption[]>([]);
  const [candidateId, setCandidateId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [items, setItems] = useState<ReferenceRow[]>([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState("");
  const [checks, setChecks] = useState<ReferenceCheck[]>([]);
  const [checkStatus, setCheckStatus] = useState<(typeof checkStatuses)[number]>("VERIFIED");
  const [checkScore, setCheckScore] = useState("");
  const [checkNotes, setCheckNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === candidateId) ?? null,
    [candidateId, candidates]
  );

  const loadRefs = async (id: string) => {
    if (!id) {
      setItems([]);
      setChecks([]);
      setSelectedReferenceId("");
      return;
    }

    const data = await apiFetch<ReferenceRow[]>(`/candidates/${id}/references`);
    setItems(data);
    setChecks([]);
    setSelectedReferenceId("");
  };

  useEffect(() => {
    void apiFetch<CandidateOption[]>("/candidates?page=1&limit=500")
      .then(setCandidates)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Personel listesi alinamadi.")
      )
      .finally(() => setLoading(false));
  }, []);

  const selectCandidate = async (id: string) => {
    setCandidateId(id);
    try {
      setError(null);
      await loadRefs(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Referanslar alinamadi.");
    }
  };

  const addRef = async () => {
    if (!candidateId || !name.trim()) {
      setError("Personel ve referans adi zorunludur.");
      return;
    }

    try {
      setError(null);
      await apiFetch(`/candidates/${candidateId}/references`, {
        method: "POST",
        body: JSON.stringify({
          full_name: name.trim(),
          phone: phone.trim() || undefined,
          relation: relation.trim() || undefined
        })
      });
      setName("");
      setPhone("");
      setRelation("");
      await loadRefs(candidateId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Referans eklenemedi.");
    }
  };

  const loadChecks = async (referenceId: string) => {
    setSelectedReferenceId(referenceId);
    try {
      setError(null);
      const data = await apiFetch<ReferenceCheck[]>(
        `/candidate-references/${referenceId}/checks`
      );
      setChecks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kontroller alinamadi.");
    }
  };

  const addCheck = async () => {
    if (!selectedReferenceId) {
      setError("Once bir referans secin.");
      return;
    }

    try {
      setError(null);
      await apiFetch(`/candidate-references/${selectedReferenceId}/checks`, {
        method: "POST",
        body: JSON.stringify({
          status: checkStatus,
          score: checkScore ? Number(checkScore) : undefined,
          notes: checkNotes.trim() || undefined
        })
      });
      setCheckScore("");
      setCheckNotes("");
      await loadChecks(selectedReferenceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kontrol eklenemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Referanslar</h2>
        <p className="mt-1 text-sm text-slate-500">
          Personeli ad soyad ile secin, referanslarini ve kontrol gecmisini goruntuleyin.
        </p>
      </div>

      <label className="block space-y-1 text-sm">
        <span>Personel</span>
        <select
          value={candidateId}
          onChange={(event) => void selectCandidate(event.target.value)}
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">{loading ? "Yukleniyor..." : "Personel secin"}</option>
          {candidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.first_name} {candidate.last_name} - {candidate.candidate_code}
            </option>
          ))}
        </select>
      </label>

      {selectedCandidate ? (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
          Secili personel: <strong>{selectedCandidate.first_name} {selectedCandidate.last_name}</strong>
          {" - "}{selectedCandidate.phone}
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Yeni Referans</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Referans ad soyad"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Telefon"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={relation}
            onChange={(event) => setRelation(event.target.value)}
            placeholder="Yakinlik / iliski"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={addRef}
          className="mt-3 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
        >
          Referans Ekle
        </button>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Yakinlik</th>
                <th className="px-4 py-3">Durum</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`cursor-pointer border-t border-slate-100 ${
                    selectedReferenceId === item.id ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                  onClick={() => void loadChecks(item.id)}
                >
                  <td className="px-4 py-3 font-medium">{item.full_name}</td>
                  <td className="px-4 py-3">{item.phone ?? "-"}</td>
                  <td className="px-4 py-3">{item.relation ?? "-"}</td>
                  <td className="px-4 py-3">
                    {referenceStatusLabels[item.status] ?? item.status}
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={4}>
                    {candidateId ? "Bu personelin referans kaydi yok." : "Once bir personel secin."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">Referans Kontrolleri</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              value={checkStatus}
              onChange={(event) =>
                setCheckStatus(event.target.value as (typeof checkStatuses)[number])
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {checkStatuses.map((status) => (
                <option key={status} value={status}>
                  {referenceStatusLabels[status]}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={100}
              value={checkScore}
              onChange={(event) => setCheckScore(event.target.value)}
              placeholder="Puan (0-100)"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <textarea
            rows={3}
            value={checkNotes}
            onChange={(event) => setCheckNotes(event.target.value)}
            placeholder="Gorusme notu"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addCheck}
            disabled={!selectedReferenceId}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
          >
            Kontrol Kaydi Ekle
          </button>

          {checks.map((check) => (
            <div key={check.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p>
                <strong>Durum:</strong> {referenceStatusLabels[check.status] ?? check.status}
              </p>
              <p><strong>Puan:</strong> {check.score ?? "-"}</p>
              <p><strong>Not:</strong> {check.notes ?? "-"}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(check.created_at).toLocaleString("tr-TR")}
              </p>
            </div>
          ))}
          {checks.length === 0 ? (
            <p className="text-sm text-slate-500">
              {selectedReferenceId ? "Kontrol kaydi yok." : "Kontroller icin bir referans secin."}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
