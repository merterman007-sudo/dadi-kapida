"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type AuditLog = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  actor_user_id: string | null;
  created_at: string;
};

export default function AuditLogsPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const qs = new URLSearchParams({ page: "1", limit: "100" });
    if (action) qs.set("action", action);
    if (entityType) qs.set("entityType", entityType);
    const data = await apiFetch<AuditLog[]>(`/audit-logs?${qs.toString()}`);
    setItems(data);
  };

  useEffect(() => {
    void load().catch((err) =>
      setError(err instanceof Error ? err.message : "Denetim kaydı alınamadı.")
    );
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Denetim Kaydı</h2>
      <div className="grid gap-2 md:grid-cols-3">
        <input value={action} onChange={(e) => setAction(e.target.value)} placeholder="Aksiyon filtresi" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={entityType} onChange={(e) => setEntityType(e.target.value)} placeholder="Varlık tipi filtresi" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button type="button" onClick={load} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Filtrele</button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Aksiyon</th>
              <th className="px-4 py-3">Varlık</th>
              <th className="px-4 py-3">Varlık ID</th>
              <th className="px-4 py-3">Aktör</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{new Date(item.created_at).toLocaleString("tr-TR")}</td>
                <td className="px-4 py-3">{item.action}</td>
                <td className="px-4 py-3">{item.entity_type}</td>
                <td className="px-4 py-3">{item.entity_id ?? "-"}</td>
                <td className="px-4 py-3">{item.actor_user_id ?? "-"}</td>
              </tr>
            ))}
            {items.length === 0 ? <tr><td className="px-4 py-5 text-slate-500" colSpan={5}>Kayıt yok.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
