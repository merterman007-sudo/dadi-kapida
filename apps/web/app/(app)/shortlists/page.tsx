"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type ShortlistRow = {
  id: string;
  family_request_id: string;
  title: string;
  notes: string | null;
  created_at: string;
};

type ShortlistItem = {
  id: string;
  candidate_id: string;
  consultant_note: string | null;
  family_feedback: string | null;
  sent_to_family_at: string | null;
  candidate: {
    first_name: string;
    last_name: string;
    city: string | null;
    district: string | null;
    status: string;
  } | null;
};

type ShortlistDetail = ShortlistRow & {
  items: ShortlistItem[];
};

export default function ShortlistsPage() {
  const [rows, setRows] = useState<ShortlistRow[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<ShortlistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<ShortlistRow[]>("/shortlists?page=1&limit=100");
        if (!mounted) {
          return;
        }
        setRows(data);
        setSelectedId((current) => current || data[0]?.id || "");
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Kısa listeler alınamadı.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!selectedId) {
      setDetail(null);
      return;
    }

    const loadDetail = async () => {
      try {
        setError(null);
        const data = await apiFetch<ShortlistDetail>(`/shortlists/${selectedId}`);
        if (mounted) {
          setDetail(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Kısa liste detayı alınamadı.");
        }
      }
    };

    void loadDetail();
    return () => {
      mounted = false;
    };
  }, [selectedId]);

  const selectedLabel = useMemo(
    () => rows.find((row) => row.id === selectedId)?.title ?? "Kısa Liste",
    [rows, selectedId]
  );

  if (loading) {
    return <p className="text-sm text-slate-600">Yükleniyor...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Kısa Listeler</h2>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Liste seçin</span>
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Seçiniz</option>
            {rows.map((row) => (
              <option key={row.id} value={row.id}>
                {row.title} - {row.family_request_id.slice(0, 8)}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          Toplam kısa liste: {rows.length}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {detail ? (
        <div className="space-y-3">
          <h3 className="font-semibold">{selectedLabel}</h3>
          <p className="text-sm text-slate-600">
            Talep: {detail.family_request_id} {detail.notes ? `- ${detail.notes}` : ""}
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Aday</th>
                  <th className="px-4 py-3">Lokasyon</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3">Danışman Notu</th>
                  <th className="px-4 py-3">Aile Geri Bildirimi</th>
                  <th className="px-4 py-3">Aileye Gönderim</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      {item.candidate
                        ? `${item.candidate.first_name} ${item.candidate.last_name}`
                        : item.candidate_id}
                    </td>
                    <td className="px-4 py-3">
                      {item.candidate?.city ?? "-"}
                      {item.candidate?.district ? ` / ${item.candidate.district}` : ""}
                    </td>
                    <td className="px-4 py-3">{item.candidate?.status ?? "-"}</td>
                    <td className="px-4 py-3">{item.consultant_note ?? "-"}</td>
                    <td className="px-4 py-3">{item.family_feedback ?? "-"}</td>
                    <td className="px-4 py-3">
                      {item.sent_to_family_at
                        ? new Date(item.sent_to_family_at).toLocaleDateString("tr-TR")
                        : "-"}
                    </td>
                  </tr>
                ))}
                {detail.items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-5 text-slate-500" colSpan={6}>
                      Bu listede aday yok.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Detay görmek için bir kısa liste seçin.</p>
      )}
    </div>
  );
}
