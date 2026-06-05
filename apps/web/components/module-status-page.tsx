"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type ModuleStatus = {
  module: string;
  status: string;
};

export function ModuleStatusPage({
  title,
  endpoint,
  subtitle
}: {
  title: string;
  endpoint: string;
  subtitle?: string;
}) {
  const [data, setData] = useState<ModuleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const payload = await apiFetch<ModuleStatus>(endpoint);
        if (mounted) {
          setData(payload);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Modül durumu alınamadı.");
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
  }, [endpoint]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {data ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p>
            <strong>Modül:</strong> {data.module}
          </p>
          <p>
            <strong>Durum:</strong> {data.status}
          </p>
        </div>
      ) : null}
    </div>
  );
}
