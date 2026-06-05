"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: number;
  due_at: string | null;
  assignee_user_id: string | null;
};

const statusLabels: Record<string, string> = {
  TODO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı",
  CANCELLED: "İptal"
};

function statusClass(status: string) {
  if (status === "DONE") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "IN_PROGRESS") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "CANCELLED") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function priorityLabel(priority: number) {
  if (priority >= 4) return "Yüksek";
  if (priority >= 2) return "Orta";
  return "Düşük";
}

export default function TasksPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState("2");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<Task[]>("/tasks?page=1&limit=100");
    setItems(data);
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Task[]>("/tasks?page=1&limit=100");
        if (mounted) {
          setItems(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Görevler alınamadı.");
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

  const stats = useMemo(
    () => ({
      open: items.filter((item) => item.status !== "DONE" && item.status !== "CANCELLED").length,
      done: items.filter((item) => item.status === "DONE").length,
      urgent: items.filter((item) => item.priority >= 4 && item.status !== "DONE").length
    }),
    [items]
  );

  const create = async () => {
    if (!title.trim()) return;
    try {
      setSaving(true);
      setError(null);
      await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          priority: Number(priority),
          due_at: dueAt ? new Date(dueAt).toISOString() : undefined
        })
      });
      setTitle("");
      setDueAt("");
      setPriority("2");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görev oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const toggleDone = async (task: Task) => {
    try {
      setError(null);
      await apiFetch(`/tasks/${task.id}/${task.status === "DONE" ? "reopen" : "complete"}`, {
        method: "POST"
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görev güncellenemedi.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Görev Takibi</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Operasyon Kontrol Listesi</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Aile talebi, görüşme, evrak ve sözleşme takiplerini görevleştirin; tamamlanan satırlar yeşile döner.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-700">Açık Görev</p>
          <p className="mt-2 text-3xl font-bold text-amber-800">{stats.open}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Tamamlanan</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">{stats.done}</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs text-red-700">Yüksek Öncelik</p>
          <p className="mt-2 text-3xl font-bold text-red-800">{stats.urgent}</p>
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_160px_140px_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Yeni görev başlığı"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="1">Düşük</option>
          <option value="2">Orta</option>
          <option value="4">Yüksek</option>
        </select>
        <button
          type="button"
          onClick={create}
          disabled={saving}
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Ekle
        </button>
      </div>

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {!loading ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Bitti</th>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Öncelik</th>
                <th className="px-4 py-3">Termin</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t transition ${
                    item.status === "DONE"
                      ? "border-emerald-100 bg-emerald-50/70 text-emerald-950"
                      : "border-slate-100"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={item.status === "DONE"}
                      onChange={() => toggleDone(item)}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className={item.status === "DONE" ? "font-medium line-through decoration-emerald-600" : "font-medium"}>
                      {item.title}
                    </p>
                    {item.description ? <p className="mt-1 text-xs text-slate-500">{item.description}</p> : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusClass(item.status)}`}>
                      {statusLabels[item.status] ?? item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{priorityLabel(item.priority)}</td>
                  <td className="px-4 py-3">
                    {item.due_at ? new Date(item.due_at).toLocaleDateString("tr-TR") : "-"}
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={5}>
                    Görev bulunamadı.
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
