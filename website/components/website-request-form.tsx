"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { postPublic } from "../lib/api";

type RequestKind = "contact" | "callback" | "online";

type WebsiteRequestFormProps = {
  kind: RequestKind;
};

const endpointByKind: Record<RequestKind, string> = {
  contact: "/api/v1/public/contact-requests",
  callback: "/api/v1/public/callback-requests",
  online: "/api/v1/public/contact-requests"
};

const labelsByKind: Record<RequestKind, { title: string; message: string; button: string }> = {
  contact: {
    title: "Kısa mesaj bırakın",
    message: "Sorunuzu veya ihtiyacınızı yazın, ekip uygun dönüşü planlasın.",
    button: "Mesajı Gönder"
  },
  callback: {
    title: "Geri aranma bilgileri",
    message: "Sizi hangi konuda ve ne zaman aramamızı istediğinizi yazabilirsiniz.",
    button: "Geri Aranma Talebi Gönder"
  },
  online: {
    title: "Online görüşme talebi",
    message: "Aile ihtiyacınızı netleştirmek için kısa bir online görüşme talebi oluşturun.",
    button: "Online Görüşme Talebi Gönder"
  }
};

export function WebsiteRequestForm({ kind }: WebsiteRequestFormProps) {
  const router = useRouter();
  const labels = labelsByKind[kind];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    preferred_time: "",
    message: "",
    consent: false,
    submitted_at: new Date().toISOString(),
    honeypot: "",
    idempotency_key: crypto.randomUUID()
  });

  const payload = useMemo(
    () => ({
      requestKind: kind,
      fullName: form.full_name,
      phone: form.phone,
      email: form.email,
      preferredTime: form.preferred_time,
      message: form.message
    }),
    [form, kind]
  );

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await postPublic<{ nextStep: string }>(endpointByKind[kind], {
        ...form,
        source: "WEBSITE",
        payload
      });
      router.push(result.nextStep as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Talep gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface mt-8 rounded-[28px] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">{labels.title}</p>
          <p className="mt-2 text-sm leading-7 text-muted">{labels.message}</p>
        </div>
        <span className="rounded-full bg-[#FAF5F7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-green">
          Hızlı dönüş
        </span>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 transition focus:border-trust focus:ring-2 focus:ring-trust/20"
            placeholder="Ad soyad"
            value={form.full_name}
            onChange={(event) => update("full_name", event.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 transition focus:border-trust focus:ring-2 focus:ring-trust/20"
            placeholder="Telefon"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 transition focus:border-trust focus:ring-2 focus:ring-trust/20"
            placeholder="E-posta"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 transition focus:border-trust focus:ring-2 focus:ring-trust/20"
            placeholder="Uygun zaman"
            value={form.preferred_time}
            onChange={(event) => update("preferred_time", event.target.value)}
          />
        </div>

        <textarea
          className="min-h-32 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 transition focus:border-trust focus:ring-2 focus:ring-trust/20"
          placeholder="Kısa not"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
        />

        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => update("consent", event.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-trust"
          />
          KVKK aydınlatma metnini okudum ve talebimin işlenmesini onaylıyorum.
        </label>

        <button
          type="button"
          disabled={loading || !form.full_name || !form.consent || (!form.phone && !form.email)}
          onClick={submit}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-green px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(233,24,91,0.20)] transition hover:bg-[#BF1047] disabled:bg-slate-500 disabled:text-white disabled:shadow-none"
        >
          {loading ? "Gönderiliyor..." : labels.button}
        </button>
      </div>
    </div>
  );
}
