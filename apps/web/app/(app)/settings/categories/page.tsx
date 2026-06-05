"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type NameRow = {
  id: string;
  name: string;
};

type LanguageRow = {
  id: string;
  name: string;
  code: string;
};

type CategoriesPayload = {
  serviceCategories: NameRow[];
  skills: NameRow[];
  certifications: NameRow[];
  languages: LanguageRow[];
};

export default function CategoriesSettingsPage() {
  const [payload, setPayload] = useState<CategoriesPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<CategoriesPayload>("/settings/categories");
        if (mounted) {
          setPayload(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Kategori verisi alınamadı.");
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Ayarlar / Kategoriler</h2>
      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {payload ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Hizmet Kategorileri" items={payload.serviceCategories.map((item) => item.name)} />
          <Card title="Yetenekler" items={payload.skills.map((item) => item.name)} />
          <Card title="Sertifikalar" items={payload.certifications.map((item) => item.name)} />
          <Card title="Diller" items={payload.languages.map((item) => `${item.name} (${item.code})`)} />
        </div>
      ) : null}
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <ul className="space-y-1 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
        {items.length === 0 ? <li className="text-slate-500">Kayıt yok.</li> : null}
      </ul>
    </div>
  );
}
