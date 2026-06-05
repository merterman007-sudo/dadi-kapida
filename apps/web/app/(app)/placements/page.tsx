"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Placement = {
  id: string;
  family_request_id: string;
  family_id: string;
  candidate_id: string;
  start_date: string;
  agreed_salary: string;
  status: string;
};

type Family = {
  id: string;
  family_name: string;
  primary_contact_name: string;
  city: string | null;
  district: string | null;
};

type Candidate = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string | null;
  district: string | null;
  status: string;
  is_placeable: boolean;
  quality_score: number | null;
};

type FamilyRequest = {
  id: string;
  family_id: string;
  title: string;
  city: string | null;
  district: string | null;
  status: string;
  start_date: string | null;
  salary_min: string | null;
  salary_max: string | null;
};

const placementStatusLabels: Record<string, string> = {
  OFFERED: "Teklif",
  ACCEPTED: "Kabul",
  ACTIVE: "Aktif",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
  TERMINATED: "Sonlandı",
  REPLACEMENT: "Değişim"
};

function candidateLabel(candidate: Candidate) {
  const location = [candidate.city, candidate.district].filter(Boolean).join(" / ");
  return `${candidate.first_name} ${candidate.last_name} · ${candidate.phone}${location ? ` · ${location}` : ""}`;
}

function familyLabel(family: Family) {
  const location = [family.city, family.district].filter(Boolean).join(" / ");
  return `${family.family_name} · ${family.primary_contact_name}${location ? ` · ${location}` : ""}`;
}

function requestLabel(request: FamilyRequest) {
  const location = [request.city, request.district].filter(Boolean).join(" / ");
  return `${request.title}${location ? ` · ${location}` : ""} · ${request.status}`;
}

function locationScore(candidate: Candidate, request: FamilyRequest | undefined) {
  if (!request?.city) return 50;
  if (!candidate.city) return 20;
  if (candidate.city.toLocaleLowerCase("tr") !== request.city.toLocaleLowerCase("tr")) return 10;
  if (!request.district || !candidate.district) return 75;
  return candidate.district.toLocaleLowerCase("tr") === request.district.toLocaleLowerCase("tr") ? 100 : 70;
}

export default function PlacementsPage() {
  const [items, setItems] = useState<Placement[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [familyRequests, setFamilyRequests] = useState<FamilyRequest[]>([]);
  const [payload, setPayload] = useState({
    family_request_id: "",
    family_id: "",
    candidate_id: "",
    start_date: "",
    agreed_salary: ""
  });
  const [familySearch, setFamilySearch] = useState("");
  const [requestSearch, setRequestSearch] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [placementRows, familyRows, candidateRows, requestRows] = await Promise.all([
      apiFetch<Placement[]>("/placements?page=1&limit=100"),
      apiFetch<Family[]>("/families?page=1&limit=100"),
      apiFetch<Candidate[]>("/candidates?page=1&limit=100"),
      apiFetch<FamilyRequest[]>("/family-requests?page=1&limit=100")
    ]);

    setItems(placementRows);
    setFamilies(familyRows);
    setCandidates(candidateRows);
    setFamilyRequests(requestRows);
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        await load();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Yerleştirmeler alınamadı.");
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

  const familyMap = useMemo(() => new Map(families.map((family) => [family.id, family])), [families]);
  const candidateMap = useMemo(
    () => new Map(candidates.map((candidate) => [candidate.id, candidate])),
    [candidates]
  );
  const requestMap = useMemo(
    () => new Map(familyRequests.map((request) => [request.id, request])),
    [familyRequests]
  );

  const selectedRequest = requestMap.get(payload.family_request_id);
  const suggestedCandidates = useMemo(() => {
    return candidates
      .filter((candidate) => candidate.is_placeable && candidate.status !== "BLACKLISTED")
      .map((candidate) => ({
        candidate,
        score:
          locationScore(candidate, selectedRequest) +
          (candidate.status === "APPROVED" ? 20 : 0) +
          Math.min(candidate.quality_score ?? 0, 20)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [candidates, selectedRequest]);

  const selectFamily = (value: string) => {
    setFamilySearch(value);
    const family = families.find((item) => familyLabel(item) === value || item.id === value);
    if (family) {
      setPayload((prev) => ({ ...prev, family_id: family.id }));
    }
  };

  const selectRequest = (value: string) => {
    setRequestSearch(value);
    const request = familyRequests.find((item) => requestLabel(item) === value || item.id === value);
    if (request) {
      setPayload((prev) => ({
        ...prev,
        family_request_id: request.id,
        family_id: request.family_id,
        start_date: request.start_date ? request.start_date.slice(0, 10) : prev.start_date,
        agreed_salary: request.salary_max ?? request.salary_min ?? prev.agreed_salary
      }));
      const family = families.find((item) => item.id === request.family_id);
      if (family) setFamilySearch(familyLabel(family));
    }
  };

  const selectCandidate = (value: string) => {
    setCandidateSearch(value);
    const candidate = candidates.find((item) => candidateLabel(item) === value || item.id === value);
    if (candidate) {
      setPayload((prev) => ({ ...prev, candidate_id: candidate.id }));
    }
  };

  const create = async () => {
    if (
      !payload.family_request_id ||
      !payload.family_id ||
      !payload.candidate_id ||
      !payload.start_date ||
      !payload.agreed_salary
    ) {
      setError("Aile talebi, aile, aday, başlangıç tarihi ve maaş gerekli.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await apiFetch("/placements", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          agreed_salary: Number(payload.agreed_salary),
          start_date: new Date(payload.start_date).toISOString()
        })
      });
      setPayload({
        family_request_id: "",
        family_id: "",
        candidate_id: "",
        start_date: "",
        agreed_salary: ""
      });
      setFamilySearch("");
      setRequestSearch("");
      setCandidateSearch("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yerleştirme oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Yerleştirme Operasyonu</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Aile + Talep + Aday Eşleştirme</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Talebi seçin, sistem lokasyon ve aday durumuna göre önerileri öne çıkarsın; uygun adayı tek tıkla yerleştirmeye bağlayın.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold">Yeni Yerleştirme</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              <span className="text-xs font-medium text-slate-600">Aile Talebi</span>
              <input
                list="family-request-options"
                value={requestSearch}
                onChange={(event) => selectRequest(event.target.value)}
                onFocus={() => setRequestSearch("")}
                placeholder="Talep adı veya lokasyon yazın"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="text-xs font-medium text-slate-600">Aile</span>
              <input
                list="family-options"
                value={familySearch}
                onChange={(event) => selectFamily(event.target.value)}
                onFocus={() => setFamilySearch("")}
                placeholder="Aile adı yazın"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="text-xs font-medium text-slate-600">Aday / Çalışan</span>
              <input
                list="candidate-options"
                value={candidateSearch}
                onChange={(event) => selectCandidate(event.target.value)}
                onFocus={() => setCandidateSearch("")}
                placeholder="Aday adı, telefon veya lokasyon yazın"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <input
              type="date"
              value={payload.start_date}
              onChange={(event) => setPayload((prev) => ({ ...prev, start_date: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={payload.agreed_salary}
              onChange={(event) => setPayload((prev) => ({ ...prev, agreed_salary: event.target.value }))}
              placeholder="Anlaşılan maaş"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <datalist id="family-request-options">
            {familyRequests.map((request) => (
              <option key={request.id} value={requestLabel(request)} />
            ))}
          </datalist>
          <datalist id="family-options">
            {families.map((family) => (
              <option key={family.id} value={familyLabel(family)} />
            ))}
          </datalist>
          <datalist id="candidate-options">
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidateLabel(candidate)} />
            ))}
          </datalist>

          <button
            type="button"
            onClick={create}
            disabled={saving}
            className="mt-4 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : "Yerleştirme Ekle"}
          </button>
        </div>

        <aside className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-emerald-900">Önerilen Adaylar</h3>
              <p className="mt-1 text-xs text-emerald-700">
                Basit bot sıralaması: önce lokasyon, sonra onay ve kalite puanı.
              </p>
            </div>
            {selectedRequest ? (
              <Link
                href={`/family-requests/${selectedRequest.id}/matches`}
                className="rounded-lg bg-white px-2 py-1 text-xs font-medium text-emerald-700"
              >
                Detay
              </Link>
            ) : null}
          </div>
          <div className="mt-4 space-y-2">
            {suggestedCandidates.map(({ candidate, score }) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => {
                  setPayload((prev) => ({ ...prev, candidate_id: candidate.id }));
                  setCandidateSearch(candidateLabel(candidate));
                }}
                className="w-full rounded-xl border border-emerald-200 bg-white p-3 text-left transition hover:border-emerald-400"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">
                    {candidate.first_name} {candidate.last_name}
                  </p>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                    {score}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {[candidate.city, candidate.district].filter(Boolean).join(" / ") || "Lokasyon yok"} · {candidate.status}
                </p>
              </button>
            ))}
          </div>
        </aside>
      </section>

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {!loading ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Yerleştirme</th>
                <th className="px-4 py-3">Aile</th>
                <th className="px-4 py-3">Aday</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Başlangıç</th>
                <th className="px-4 py-3">Maaş</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const family = familyMap.get(item.family_id);
                const candidate = candidateMap.get(item.candidate_id);

                return (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <Link href={`/placements/${item.id}`} className="font-medium text-[var(--brand)]">
                        {item.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{family?.family_name ?? item.family_id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      {candidate ? `${candidate.first_name} ${candidate.last_name}` : item.candidate_id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3">{placementStatusLabels[item.status] ?? item.status}</td>
                    <td className="px-4 py-3">{new Date(item.start_date).toLocaleDateString("tr-TR")}</td>
                    <td className="px-4 py-3">{Number(item.agreed_salary).toLocaleString("tr-TR")} TL</td>
                  </tr>
                );
              })}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={6}>
                    Yerleştirme bulunamadı.
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
