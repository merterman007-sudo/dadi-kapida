"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { familyStatusDescriptions, familyStatusLabels } from "@/lib/status-map";

type Family = {
  id: string;
  family_name: string;
  primary_contact_name: string;
  primary_contact_phone: string;
  primary_contact_email: string | null;
  city: string | null;
  district: string | null;
  status: string;
};

export default function FamiliesPage() {
  const [items, setItems] = useState<Family[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<Family[]>(`/families?page=1&limit=100`);
    setItems(data);
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Family[]>(`/families?page=1&limit=100`);
        if (mounted) setItems(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Aile listesi alınamadı.");
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
    return items.filter((family) =>
      `${family.family_name} ${family.primary_contact_name} ${family.primary_contact_phone} ${family.primary_contact_email ?? ""}`
        .toLocaleLowerCase("tr")
        .includes(query)
    );
  }, [items, q]);

  const remove = async (family: Family) => {
    const confirmed = window.confirm(`${family.family_name} ailesini silmek istiyor musunuz?`);
    if (!confirmed) return;

    try {
      setError(null);
      await apiFetch(`/families/${family.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aile silinemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Aileler</h2>
        <Link href="/families/new" className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white">
          Yeni Aile
        </Link>
      </div>

      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Aile adı veya iletişim bilgisi ile ara"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Aile</th>
                <th className="px-4 py-3">Birincil İletişim</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Lokasyon</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((family) => (
                <tr key={family.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/families/${family.id}`} className="font-medium text-[var(--brand)]">
                      {family.family_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {family.primary_contact_name} ({family.primary_contact_phone})
                  </td>
                  <td className="px-4 py-3">{family.primary_contact_email ?? "-"}</td>
                  <td className="px-4 py-3">
                    {family.city ?? "-"}
                    {family.district ? ` / ${family.district}` : ""}
                  </td>
                  <td className="px-4 py-3" title={familyStatusDescriptions[family.status] ?? family.status}>
                    {familyStatusLabels[family.status] ?? family.status}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => remove(family)}
                      className="rounded border border-red-200 px-2 py-1 text-xs text-red-700"
                    >
                      Sil
                    </button>
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
