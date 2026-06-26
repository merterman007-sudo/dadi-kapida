"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { meetingStatusLabels, meetingTypeLabels } from "@/lib/status-map";

type Meeting = {
  id: string;
  type: string;
  status: string;
  title: string;
  contact_phone: string | null;
  starts_at: string;
};

const meetingTypes = [
  "FAMILY_INTAKE",
  "CANDIDATE_INTERVIEW",
  "FAMILY_CANDIDATE_MEETING",
  "FOLLOW_UP",
  "REFERENCE_CALL"
] as const;

export default function MeetingsPage() {
  const [items, setItems] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
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
    void load()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Görüşmeler alınamadı.")
      )
      .finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!title.trim() || !startsAt) {
      setError("Başlık ve görüşme tarihi zorunludur.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await apiFetch("/meetings", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          contact_phone: phone.trim() || undefined,
          type,
          starts_at: new Date(startsAt).toISOString()
        })
      });
      setTitle("");
      setPhone("");
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
      setError(null);
      await apiFetch(`/meetings/${id}/complete`, { method: "POST" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görüşme güncellenemedi.");
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Bu görüşmeyi silmek istediğinize emin misiniz?")) return;
    try {
      setError(null);
      await apiFetch(`/meetings/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görüşme silinemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Takvim</p>
        <h2 className="mt-2 text-2xl font-bold">Görüşmeler</h2>
        <p className="mt-1 text-sm text-slate-500">
          Planlanan arama ve görüşmeleri iletişim numarasıyla birlikte kaydedin.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1 text-sm">
            <span>Başlık</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Örn. Aile ile ilk görüşme"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>İletişim Numarası</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="05xx xxx xx xx"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Görüşme Türü</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as (typeof meetingTypes)[number])}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {meetingTypes.map((item) => (
                <option key={item} value={item}>
                  {meetingTypeLabels[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span>Tarih ve Saat</span>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => void create()}
          disabled={saving}
          className="mt-4 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Görüşme Ekle"}
        </button>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}

      {!loading ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3">İletişim</th>
                <th className="px-4 py-3">Tür</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">{item.contact_phone ?? "-"}</td>
                  <td className="px-4 py-3">{meetingTypeLabels[item.type] ?? item.type}</td>
                  <td className="px-4 py-3">{meetingStatusLabels[item.status] ?? item.status}</td>
                  <td className="px-4 py-3">
                    {new Date(item.starts_at).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-50"
                        onClick={() => void complete(item.id)}
                        disabled={item.status === "COMPLETED"}
                      >
                        Tamamla
                      </button>
                      <button
                        type="button"
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                        onClick={() => void remove(item.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={6}>
                    Kayıtlı görüşme yok.
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
