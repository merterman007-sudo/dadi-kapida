"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Meeting = {
  id: string;
  type: string;
  status: string;
  title: string;
  starts_at: string;
  location: string | null;
};

const meetingTypes = [
  "FAMILY_INTAKE",
  "CANDIDATE_INTERVIEW",
  "FAMILY_CANDIDATE_MEETING",
  "FOLLOW_UP",
  "REFERENCE_CALL"
] as const;

export default function Page() {
  const [items, setItems] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<(typeof meetingTypes)[number]>("FOLLOW_UP");
  const [startsAt, setStartsAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<Meeting[]>("/meetings?page=1&limit=100");
    setItems(data);
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Meeting[]>("/meetings?page=1&limit=100");
        if (mounted) {
          setItems(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Görüşmeler alınamadı.");
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

  const create = async () => {
    if (!title.trim() || !startsAt) return;
    try {
      setSaving(true);
      setError(null);
      await apiFetch("/meetings", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          type,
          starts_at: new Date(startsAt).toISOString()
        })
      });
      setTitle("");
      setStartsAt("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görüşme oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const complete = async (id: string) => {
    try {
      await apiFetch(`/meetings/${id}/complete`, { method: "POST" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görüşme güncellenemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Görüşmeler</h2>
      <div className="grid gap-2 md:grid-cols-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Başlık"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as (typeof meetingTypes)[number])}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {meetingTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(event) => setStartsAt(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="button"
        onClick={create}
        disabled={saving}
        className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        Görüşme Ekle
      </button>
      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!loading ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3">Tip</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Başlangıç</th>
                <th className="px-4 py-3">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{new Date(item.starts_at).toLocaleString("tr-TR")}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded border border-slate-300 px-2 py-1 text-xs"
                      onClick={() => complete(item.id)}
                      disabled={item.status === "COMPLETED"}
                    >
                      Tamamla
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={5}>
                    Görüşme bulunamadı.
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
