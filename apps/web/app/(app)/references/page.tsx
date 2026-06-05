"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api-client";

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
};

export default function ReferencesPage() {
  const [candidateId, setCandidateId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [items, setItems] = useState<ReferenceRow[]>([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState("");
  const [checks, setChecks] = useState<ReferenceCheck[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadRefs = async () => {
    if (!candidateId.trim()) return;
    try {
      setError(null);
      const data = await apiFetch<ReferenceRow[]>(`/candidates/${candidateId}/references`);
      setItems(data);
      if (data[0]) {
        setSelectedReferenceId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Referanslar alınamadı.");
    }
  };

  const addRef = async () => {
    if (!candidateId.trim() || !name.trim()) return;
    try {
      await apiFetch(`/candidates/${candidateId}/references`, {
        method: "POST",
        body: JSON.stringify({ full_name: name.trim(), phone: phone || undefined, relation: relation || undefined })
      });
      setName("");
      setPhone("");
      setRelation("");
      await loadRefs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Referans eklenemedi.");
    }
  };

  const loadChecks = async (referenceId: string) => {
    if (!referenceId) return;
    try {
      const data = await apiFetch<ReferenceCheck[]>(`/candidate-references/${referenceId}/checks`);
      setChecks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kontroller alınamadı.");
    }
  };

  const addCheck = async () => {
    if (!selectedReferenceId) return;
    try {
      await apiFetch(`/candidate-references/${selectedReferenceId}/checks`, {
        method: "POST",
        body: JSON.stringify({ status: "VERIFIED", score: 85, notes: "Telefon görüşmesi olumlu." })
      });
      await loadChecks(selectedReferenceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kontrol eklenemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Referanslar</h2>
      <div className="grid gap-2 md:grid-cols-4">
        <input value={candidateId} onChange={(e) => setCandidateId(e.target.value)} placeholder="Candidate ID" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
        <button type="button" onClick={loadRefs} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Listele</button>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Referans adı" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Yakınlık" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button type="button" onClick={addRef} className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white">Ekle</button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Ad</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Durum</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t border-slate-100 cursor-pointer ${selectedReferenceId === item.id ? "bg-slate-50" : ""}`}
                  onClick={() => {
                    setSelectedReferenceId(item.id);
                    void loadChecks(item.id);
                  }}
                >
                  <td className="px-4 py-3">{item.full_name}</td>
                  <td className="px-4 py-3">{item.phone ?? "-"}</td>
                  <td className="px-4 py-3">{item.status}</td>
                </tr>
              ))}
              {items.length === 0 ? <tr><td className="px-4 py-5 text-slate-500" colSpan={3}>Kayıt yok.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Referans Kontrolleri</h3>
            <button type="button" onClick={addCheck} className="rounded border border-slate-300 px-2 py-1 text-xs">Kontrol Ekle</button>
          </div>
          {checks.map((check) => (
            <div key={check.id} className="rounded border border-slate-200 p-2 text-sm">
              <p><strong>Durum:</strong> {check.status}</p>
              <p><strong>Puan:</strong> {check.score ?? "-"}</p>
              <p><strong>Not:</strong> {check.notes ?? "-"}</p>
            </div>
          ))}
          {checks.length === 0 ? <p className="text-sm text-slate-500">Kontrol yok.</p> : null}
        </div>
      </div>
    </div>
  );
}
