"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiFetch } from "@/lib/api-client";

type DashboardMetrics = {
  totalApplications: number;
  todayApplications: number;
  totalCandidates: number;
  approvedCandidates: number;
  totalFamilies: number;
  activeFamilies: number;
  activeFamilyRequests: number;
  openTasks: number;
  pendingPayments: number;
};

type DashboardTrendPoint = {
  date: string;
  label: string;
  applications: number;
  requests: number;
  placements: number;
  completedTasks: number;
};

type MetricCard = {
  key: keyof DashboardMetrics;
  label: string;
  icon: React.ReactNode;
  color: string;
};

function IconInbox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
  );
}
function IconZap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconUserCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}
function IconCheckSquare() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function IconCreditCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

const cards: readonly MetricCard[] = [
  { key: "totalApplications", label: "Toplam Başvuru", icon: <IconInbox />, color: "#3b82f6" },
  { key: "todayApplications", label: "Bugünkü Başvuru", icon: <IconZap />, color: "#f59e0b" },
  { key: "totalCandidates", label: "Toplam Aday", icon: <IconUser />, color: "#8b5cf6" },
  { key: "approvedCandidates", label: "Onaylı Aday", icon: <IconUserCheck />, color: "#10b981" },
  { key: "totalFamilies", label: "Toplam Aile", icon: <IconUsers />, color: "#0f766e" },
  { key: "activeFamilies", label: "Aktif Aile", icon: <IconHome />, color: "#0ea5e9" },
  { key: "activeFamilyRequests", label: "Aktif Talep", icon: <IconClipboard />, color: "#ef4444" },
  { key: "openTasks", label: "Açık Görev", icon: <IconCheckSquare />, color: "#f97316" },
  { key: "pendingPayments", label: "Bekleyen Ödeme", icon: <IconCreditCard />, color: "#6366f1" }
] as const;

const quickActions = [
  {
    href: "/candidates/new",
    title: "Yeni Aday",
    description: "Profili hızlıca aç ve süreci başlat."
  },
  {
    href: "/families/new",
    title: "Yeni Aile",
    description: "Aile kaydı oluştur, taleplere hazırla."
  },
  {
    href: "/family-requests/new",
    title: "Yeni Talep",
    description: "Talebi oluştur ve eşleştirmeye gönder."
  },
  {
    href: "/reports",
    title: "Rapor Merkezi",
    description: "Anlık performans ve üretkenlik görünümü."
  }
] as const;

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="surface rounded-2xl p-4 animate-pulse">
              <div className="h-3 w-24 rounded bg-[#dce8f7]" />
              <div className="mt-4 h-8 w-16 rounded bg-[#dce8f7]" />
            </div>
          ))}
        </div>
        <div className="surface rounded-2xl p-4 animate-pulse">
          <div className="h-4 w-32 rounded bg-[#dce8f7]" />
          <div className="mt-2 h-3 w-48 rounded bg-[#dce8f7]" />
          <div className="mt-4 h-56 rounded-xl bg-[#e9f1fb]" />
        </div>
      </div>
      <div className="surface rounded-2xl p-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-[#dce8f7]" />
        <div className="mt-2 h-3 w-44 rounded bg-[#dce8f7]" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-[#e9f1fb]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [trendData, setTrendData] = useState<DashboardTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setChartReady(true);
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, trend] = await Promise.all([
          apiFetch<DashboardMetrics>("/dashboard"),
          apiFetch<DashboardTrendPoint[]>("/dashboard/trend")
        ]);
        if (mounted) {
          setMetrics(data);
          setTrendData(trend);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Panel metrikleri alınamadı.");
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

  const items = useMemo(
    () =>
      metrics
        ? cards.map((item) => ({
            ...item,
            value: metrics[item.key]
          }))
        : [],
    [metrics]
  );

  const chartRows = useMemo(() => {
    if (!items.length) return [];
    const maxValue = Math.max(...items.map((item) => item.value), 1);
    return items.map((item) => ({
      ...item,
      ratio: Math.max(8, Math.round((item.value / maxValue) * 100))
    }));
  }, [items]);

  return (
    <div className="space-y-5">
      <div className="surface fade-up rounded-2xl p-4 md:p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Yönetim Paneli</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Operasyon Özeti</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Güncel akış, aday ve finans sinyallerini tek bakışta izleyin.
        </p>
      </div>

      {loading ? <DashboardSkeleton /> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {metrics ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <div
                  key={item.label}
                  className="surface fade-up rounded-2xl p-4"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{item.label}</p>
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${item.color}18`, color: item.color }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-bold tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="surface rounded-2xl p-4">
              <p className="text-sm font-semibold">Operasyon Trendi</p>
              <p className="mb-4 mt-1 text-xs text-[var(--muted)]">Haftalık başvuru ve aktif talep sinyali.</p>
              <div className="h-60 rounded-xl bg-[linear-gradient(180deg,#f9fcff_0%,#eef6ff_100%)] p-3">
                {chartReady ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 12, right: 10, left: -16, bottom: 0 }}>
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#7287a6", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#7287a6", fontSize: 12 }} width={30} />
                      <Tooltip
                        cursor={{ stroke: "#d9e7fb", strokeWidth: 1 }}
                        contentStyle={{
                          border: "1px solid #cfe0f5",
                          borderRadius: "12px",
                          background: "#ffffff",
                          boxShadow: "0 8px 22px rgba(27, 65, 119, 0.12)"
                        }}
                      />
                      <Line type="monotone" dataKey="applications" name="Başvuru" stroke="#0b6bcb" strokeWidth={2.5} dot={{ r: 2.5 }} />
                      <Line type="monotone" dataKey="requests" name="Talep" stroke="#13b0b8" strokeWidth={2.5} dot={{ r: 2.5 }} />
                      <Line type="monotone" dataKey="placements" name="Yerleştirme" stroke="#10a36a" strokeWidth={2.5} dot={{ r: 2.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : null}
              </div>
            </div>

            <div className="surface rounded-2xl p-4">
              <p className="text-sm font-semibold">Metrik Dağılımı</p>
              <p className="mb-4 mt-1 text-xs text-[var(--muted)]">Anlık hacimlerin karşılaştırmalı görünümü.</p>
              <div className="space-y-3">
                {chartRows.map((row) => (
                  <div key={row.key}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-[var(--muted)]">{row.label}</span>
                      <span className="font-semibold text-[var(--ink)]">{row.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e7f0fb]">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${row.ratio}%`,
                          background: `linear-gradient(90deg, ${row.color}cc, ${row.color})`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="surface rounded-2xl p-4">
            <p className="text-sm font-semibold">Hızlı Aksiyonlar</p>
            <p className="mb-4 mt-1 text-xs text-[var(--muted)]">Sık kullanılan operasyon adımlarına kısayol.</p>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="block rounded-xl border border-[var(--line)] bg-white p-3 transition hover:border-[#9dc3ec] hover:bg-[#f3f8ff]"
                >
                  <p className="text-sm font-semibold">{action.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
