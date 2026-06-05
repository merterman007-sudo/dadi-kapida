"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { familyRequestStatusLabels } from "@/lib/status-map";

type FamilyRequest = {
  id: string;
  family_id: string;
  title: string;
  status: string;
  priority: number | null;
  city: string | null;
  district: string | null;
  created_at: string;
};

export default function FamilyRequestsPage() {
  const [items, setItems] = useState<FamilyRequest[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<FamilyRequest[]>(`/family-requests?page=1&limit=100`);
        if (mounted) setItems(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Talep listesi alınamadı.");
      } finally {
        if (mounted) setLoading(false);
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
    return items.filter((item) =>
      `${item.title} ${item.city ?? ""} ${item.district ?? ""}`.toLocaleLowerCase("tr").includes(query)
    );
  }, [items, q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Aile Talepleri</h2>
        <Link href="/family-requests/new" className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white">
          Yeni Talep
        </Link>
      </div>

      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Başlık veya lokasyon ile ara"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3">Aile ID</th>
                <th className="px-4 py-3">Lokasyon</th>
                <th className="px-4 py-3">Öncelik</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Öneriler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/family-requests/${item.id}`} className="font-medium text-[var(--brand)]">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{item.family_id}</td>
                  <td className="px-4 py-3">
                    {item.city ?? "-"}
                    {item.district ? ` / ${item.district}` : ""}
                  </td>
                  <td className="px-4 py-3">{item.priority ?? "-"}</td>
                  <td className="px-4 py-3">{familyRequestStatusLabels[item.status] ?? item.status}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/family-requests/${item.id}/matches`}
                      className="rounded border border-emerald-200 px-2 py-1 text-xs font-medium text-emerald-700"
                    >
                      Önerilen Adaylar
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={6}>
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
