"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  district: string | null;
  status: string;
  created_at: string;
};

export default function ApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Application[]>(`/applications?page=1&limit=100`);
        if (mounted) setItems(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Başvuru listesi alınamadı.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = async () => {
    const data = await apiFetch<Application[]>(`/applications?page=1&limit=100`);
    setItems(data);
  };

  const runAction = async (id: string, action: "convert" | "reject" | "duplicate") => {
    const pathMap = {
      convert: `/applications/${id}/convert-to-candidate`,
      reject: `/applications/${id}/reject`,
      duplicate: `/applications/${id}/mark-duplicate`
    } as const;

    try {
      setError(null);
      await apiFetch(pathMap[action], { method: "POST" });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aksiyon başarısız.");
    }
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLocaleLowerCase("tr");
    if (!query) return items;
    return items.filter((item) =>
      `${item.first_name} ${item.last_name} ${item.phone} ${item.email ?? ""}`.toLocaleLowerCase("tr").includes(query)
    );
  }, [items, q]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Başvurular</h2>

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
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/applications/${item.id}`} className="font-medium text-[var(--brand)]">
                      {item.first_name} {item.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{item.phone}</td>
                  <td className="px-4 py-3">{item.email ?? "-"}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                        onClick={() => runAction(item.id, "convert")}
                      >
                        Adaya Dönüştür
                      </button>
                      <button
                        type="button"
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                        onClick={() => runAction(item.id, "reject")}
                      >
                        Reddet
                      </button>
                      <button
                        type="button"
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                        onClick={() => runAction(item.id, "duplicate")}
                      >
                        Mükerrer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={5}>
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
