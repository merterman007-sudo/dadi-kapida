"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type NoteRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  content: string;
  pinned: boolean;
  created_at: string;
};

export default function NotesPage() {
  const [entityType, setEntityType] = useState("CANDIDATE");
  const [entityId, setEntityId] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const qs = new URLSearchParams({ page: "1", limit: "100" });
    if (entityType) qs.set("entityType", entityType);
    if (entityId) qs.set("entityId", entityId);
    const data = await apiFetch<NoteRow[]>(`/notes?${qs.toString()}`);
    setNotes(data);
  };

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError(null);
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Notlar alınamadı.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const create = async () => {
    if (!entityId.trim() || !content.trim()) return;
    try {
      setError(null);
      await apiFetch("/notes", {
        method: "POST",
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId.trim(),
          content: content.trim()
        })
      });
      setContent("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Not oluşturulamadı.");
    }
  };

  const pin = async (id: string, pinned: boolean) => {
    try {
      await apiFetch(`/notes/${id}/pin`, {
        method: "POST",
        body: JSON.stringify({ pinned: !pinned })
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Not güncellenemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Notlar</h2>
      <div className="grid gap-2 md:grid-cols-3">
        <input
          value={entityType}
          onChange={(event) => setEntityType(event.target.value)}
          placeholder="Varlık Tipi"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          value={entityId}
          onChange={(event) => setEntityId(event.target.value)}
          placeholder="Varlık ID"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          Filtrele
        </button>
      </div>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Yeni not"
        rows={3}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="button"
        onClick={create}
        className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white"
      >
        Not Ekle
      </button>
      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <p className="text-xs text-slate-500">
              {note.entity_type} / {note.entity_id}
            </p>
            <p className="mt-1">{note.content}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {new Date(note.created_at).toLocaleString("tr-TR")}
              </span>
              <button
                type="button"
                className="rounded border border-slate-300 px-2 py-1 text-xs"
                onClick={() => pin(note.id, note.pinned)}
              >
                {note.pinned ? "Pin Kaldır" : "Pinle"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
