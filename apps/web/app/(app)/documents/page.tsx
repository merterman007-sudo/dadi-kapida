"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api-client";

type CandidateDocument = {
  id: string;
  document_type: string;
  file_name: string;
  status: string;
  reject_reason: string | null;
};

export default function DocumentsPage() {
  const [candidateId, setCandidateId] = useState("");
  const [docType, setDocType] = useState("kimlik");
  const [fileName, setFileName] = useState("belge.pdf");
  const [filePath, setFilePath] = useState("/tmp/belge.pdf");
  const [items, setItems] = useState<CandidateDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!candidateId.trim()) return;
    try {
      setError(null);
      const data = await apiFetch<CandidateDocument[]>(`/candidates/${candidateId}/documents`);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evraklar alınamadı.");
    }
  };

  const create = async () => {
    if (!candidateId.trim()) return;
    try {
      setError(null);
      await apiFetch(`/candidates/${candidateId}/documents`, {
        method: "POST",
        body: JSON.stringify({
          document_type: docType,
          file_name: fileName,
          file_path: filePath
        })
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evrak oluşturulamadı.");
    }
  };

  const verify = async (id: string) => {
    try {
      await apiFetch(`/candidate-documents/${id}/verify`, { method: "PATCH" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Doğrulama başarısız.");
    }
  };

  const reject = async (id: string) => {
    try {
      await apiFetch(`/candidate-documents/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason: "Eksik evrak" })
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reddetme başarısız.");
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Bu evrak kaydını silmek istediğinize emin misiniz?")) return;
    try {
      await apiFetch(`/candidate-documents/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evrak silinemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Evraklar</h2>
      <div className="grid gap-2 md:grid-cols-4">
        <input value={candidateId} onChange={(e) => setCandidateId(e.target.value)} placeholder="Personel ID" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
        <button type="button" onClick={load} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Listele</button>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        <input value={docType} onChange={(e) => setDocType(e.target.value)} placeholder="Belge tipi" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Dosya adı" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={filePath} onChange={(e) => setFilePath(e.target.value)} placeholder="Dosya yolu" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button type="button" onClick={create} className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white">Ekle</button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Belge</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Red Nedeni</th>
              <th className="px-4 py-3">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{item.document_type} - {item.file_name}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.reject_reason ?? "-"}</td>
                <td className="px-4 py-3 space-x-2">
                  <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => verify(item.id)}>Doğrula</button>
                  <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => reject(item.id)}>Reddet</button>
                  <button type="button" className="rounded border border-red-200 px-2 py-1 text-xs text-red-600" onClick={() => remove(item.id)}>Sil</button>
                </td>
              </tr>
            ))}
            {items.length === 0 ? <tr><td className="px-4 py-5 text-slate-500" colSpan={4}>Kayıt yok.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
