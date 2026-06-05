"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type MessageRow = {
  id: string;
  channel: string;
  direction: string;
  to_value: string | null;
  subject: string | null;
  content: string;
  sent_at: string | null;
};

export default function MessagesPage() {
  const [items, setItems] = useState<MessageRow[]>([]);
  const [channel, setChannel] = useState("WHATSAPP");
  const [direction, setDirection] = useState("OUTBOUND");
  const [toValue, setToValue] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<MessageRow[]>("/messages?page=1&limit=100");
    setItems(data);
  };

  useEffect(() => {
    void load().catch((err) =>
      setError(err instanceof Error ? err.message : "Mesajlar alınamadı.")
    );
  }, []);

  const create = async () => {
    if (!content.trim()) return;
    try {
      setError(null);
      await apiFetch("/messages", {
        method: "POST",
        body: JSON.stringify({
          channel,
          direction,
          to_value: toValue || undefined,
          subject: subject || undefined,
          content
        })
      });
      setContent("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj oluşturulamadı.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mesajlar</h2>
      <div className="grid gap-2 md:grid-cols-4">
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Kanal" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={direction} onChange={(e) => setDirection(e.target.value)} placeholder="Yön" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={toValue} onChange={(e) => setToValue(e.target.value)} placeholder="Alıcı" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Konu" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Mesaj içeriği" rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <button type="button" onClick={create} className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white">Mesaj Ekle</button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Kanal</th>
              <th className="px-4 py-3">Yön</th>
              <th className="px-4 py-3">Alıcı</th>
              <th className="px-4 py-3">Konu</th>
              <th className="px-4 py-3">İçerik</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{item.channel}</td>
                <td className="px-4 py-3">{item.direction}</td>
                <td className="px-4 py-3">{item.to_value ?? "-"}</td>
                <td className="px-4 py-3">{item.subject ?? "-"}</td>
                <td className="px-4 py-3">{item.content}</td>
              </tr>
            ))}
            {items.length === 0 ? <tr><td className="px-4 py-5 text-slate-500" colSpan={5}>Kayıt yok.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
