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

const docStatusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  VERIFIED: "Doğrulandı",
  REJECTED: "Reddedildi"
};

export default function DocumentsPage() {
  const [candidateId, setCandidateId] = useState("");
  const [docType, setDocType] = useState("kimlik");
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [items, setItems] = useState<CandidateDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    if (!candidateId.trim()) return;
    try {
      setError(null);
      const data = await apiFetch<CandidateDocument[]>(`/candidates/${candidateId.trim()}/documents`);
      setItems(data);
      setLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evraklar alınamadı.");
    }
  };

  const create = async () => {
    if (!candidateId.trim() || !fileName.trim()) {
      setError("Personel ID ve dosya adı zorunludur.");
      return;
    }
    try {
      setError(null);
      await apiFetch(`/candidates/${candidateId.trim()}/documents`, {
        method: "POST",
        body: JSON.stringify({
          document_type: docType.trim() || "kimlik",
          file_name: fileName.trim(),
          file_path: filePath.trim() || fileName.trim()
        })
      });
      setFileName("");
      setFilePath("");
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
    const reason = rejectReason.trim() || window.prompt("Red nedeni girin:") ?? "";
    if (!reason) return;
    try {
      await apiFetch(`/candidate-documents/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason })
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
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Evrak Yönetimi</p>
        <h2 className="mt-2 text-2xl font-bold">Evraklar</h2>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <p className="text-sm font-semibold">Personel Evraklarını Listele</p>
        <div className="flex gap-2">
          <input
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            placeholder="Personel ID (UUID)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Listele
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <p className="text-sm font-semibold">Yeni Evrak Ekle</p>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            placeholder="Belge tipi (örn: kimlik)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Dosya adı *"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            placeholder="Dosya yolu (boş bırakılırsa dosya adı kullanılır)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2 items-center">
          <input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Red nedeni (reddetmeden önce doldurun)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void create()}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
          >
            Evrak Ekle
          </button>
        </div>
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
                <td className="px-4 py-3">
                  <p className="font-medium">{item.document_type}</p>
                  <p className="text-xs text-[var(--muted)]">{item.file_name}</p>
                </td>
                <td className="px-4 py-3">{docStatusLabels[item.status] ?? item.status}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{item.reject_reason ?? "-"}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-xs"
                    onClick={() => void verify(item.id)}
                  >
                    Doğrula
                  </button>
                  <button
                    type="button"
                    className="rounded border border-amber-200 px-2 py-1 text-xs text-amber-700"
                    onClick={() => void reject(item.id)}
                  >
                    Reddet
                  </button>
                  <button
                    type="button"
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                    onClick={() => void remove(item.id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {loaded && items.length === 0 ? (
              <tr>
                <td className="px-4 py-5 text-slate-500" colSpan={4}>
                  Bu personel için evrak kaydı yok.
                </td>
              </tr>
            ) : null}
            {!loaded ? (
              <tr>
                <td className="px-4 py-5 text-slate-400 text-center" colSpan={4}>
                  Personel ID girin ve "Listele" butonuna tıklayın.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
