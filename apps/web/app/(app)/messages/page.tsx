"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { messageChannelLabels, messageDirectionLabels } from "@/lib/status-map";

type MessageRow = {
  id: string;
  channel: string;
  direction: string;
  to_value: string | null;
  from_value: string | null;
  subject: string | null;
  content: string;
  sent_at: string | null;
};

type WebsiteSubmissionRow = {
  id: string;
  form_type: string;
  status: string;
  payload: Record<string, unknown>;
  created_at: string;
};

const websiteFormLabels: Record<string, string> = {
  contact_request: "İletişim Formu",
  callback_request: "Geri Arama Talebi",
  newsletter_subscription: "Bülten Kaydı"
};

const submissionStatusLabels: Record<string, string> = {
  NEW: "Yeni",
  REVIEWING: "İnceleniyor",
  SYNCED: "CRM'e Aktarıldı",
  FAILED: "Aktarım Hatası"
};

function payloadText(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value : null;
}

export default function MessagesPage() {
  const [items, setItems] = useState<MessageRow[]>([]);
  const [websiteSubmissions, setWebsiteSubmissions] = useState<WebsiteSubmissionRow[]>([]);
  const [channel, setChannel] = useState("WHATSAPP");
  const [direction, setDirection] = useState("OUTBOUND");
  const [toValue, setToValue] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [data, websiteData] = await Promise.all([
      apiFetch<MessageRow[]>("/messages?page=1&limit=100"),
      apiFetch<WebsiteSubmissionRow[]>("/messages/website-submissions?limit=50")
    ]);
    setItems(data);
    setWebsiteSubmissions(websiteData);
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
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Web Sitesi Talepleri</h3>
            <p className="text-sm text-slate-500">İletişim, geri arama ve online görüşme formlarından gelen kayıtlar.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {websiteSubmissions.length} kayıt
          </span>
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {websiteSubmissions.map((item) => {
            const name = payloadText(item.payload, "full_name") ?? "İsimsiz talep";
            const phone = payloadText(item.payload, "phone");
            const email = payloadText(item.payload, "email");
            const message = payloadText(item.payload, "message");
            const preferredTime = payloadText(item.payload, "preferred_time");

            return (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
                      {websiteFormLabels[item.form_type] ?? item.form_type}
                    </p>
                    <h4 className="mt-1 font-semibold text-slate-950">{name}</h4>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                    {submissionStatusLabels[item.status] ?? item.status}
                  </span>
                </div>
                <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-slate-500">Telefon</dt>
                    <dd>{phone ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">E-posta</dt>
                    <dd>{email ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Uygun zaman</dt>
                    <dd>{preferredTime ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Tarih</dt>
                    <dd>{new Date(item.created_at).toLocaleString("tr-TR")}</dd>
                  </div>
                </dl>
                {message ? <p className="mt-3 rounded-lg bg-white p-3 text-sm leading-6 text-slate-700">{message}</p> : null}
              </article>
            );
          })}
          {websiteSubmissions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              Henüz web sitesi mesajı yok.
            </p>
          ) : null}
        </div>
      </section>
      <div className="grid gap-2 md:grid-cols-4">
        <select value={channel} onChange={(e) => setChannel(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="WHATSAPP">WhatsApp</option>
          <option value="SMS">SMS</option>
          <option value="EMAIL">E-posta</option>
          <option value="PHONE">Telefon</option>
        </select>
        <select value={direction} onChange={(e) => setDirection(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="OUTBOUND">Giden</option>
          <option value="INBOUND">Gelen</option>
        </select>
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
                <td className="px-4 py-3">{messageChannelLabels[item.channel] ?? item.channel}</td>
                <td className="px-4 py-3">{messageDirectionLabels[item.direction] ?? item.direction}</td>
                <td className="px-4 py-3">{item.to_value ?? item.from_value ?? "-"}</td>
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
