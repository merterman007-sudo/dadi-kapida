"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type GenericReport = Record<string, number | string | null>;

type ReportSection = {
  id: string;
  title: string;
  description: string;
  data: GenericReport;
  color: string;
};

const labels: Record<string, string> = {
  applications: "Başvurular",
  candidates: "Adaylar",
  families: "Aileler",
  familyRequests: "Aile Talepleri",
  placements: "Yerleştirmeler",
  pendingInvoices: "Bekleyen Faturalar",
  total: "Toplam",
  approved: "Onaylı",
  rejected: "Reddedilen",
  passive: "Pasif",
  new: "Yeni",
  converted: "Adaya Dönüşen",
  duplicate: "Tekrarlı",
  open: "Açık",
  matching: "Eşleştirme",
  shortlisted: "Kısa Liste",
  placed: "Yerleşti",
  active: "Aktif",
  completed: "Tamamlandı",
  cancelled: "İptal",
  paidInvoices: "Ödenen",
  totalPaidAmount: "Tahsilat"
};

const colors = ["#0b6bcb", "#13b0b8", "#10a36a", "#f59e0b", "#7c3aed", "#ef4444"];

function getDefaultRange() {
  const today = new Date();
  const from = new Date();
  from.setDate(today.getDate() - 30);

  return {
    from: from.toISOString().slice(0, 10),
    to: today.toISOString().slice(0, 10)
  };
}

function formatValue(value: number | string | null) {
  if (typeof value === "number") {
    return new Intl.NumberFormat("tr-TR").format(value);
  }
  return value ?? "-";
}

function buildQuery(from: string, to: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return params.toString();
}

function Donut({ sections }: { sections: ReportSection[] }) {
  const total = sections.reduce((sum, section) => {
    const value = Number(section.data.total ?? section.data.applications ?? 0);
    return sum + value;
  }, 0);

  let cursor = 0;
  const gradient = sections
    .map((section, index) => {
      const value = Number(section.data.total ?? section.data.applications ?? 0);
      const start = cursor;
      const end = total > 0 ? cursor + (value / total) * 100 : cursor;
      cursor = end;
      return `${colors[index % colors.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5">
      <div
        className="grid h-52 w-52 place-items-center rounded-full"
        style={{ background: total > 0 ? `conic-gradient(${gradient})` : "#e7f0fb" }}
      >
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center shadow-inner">
          <div>
            <p className="text-xs text-slate-500">Toplam hacim</p>
            <p className="text-2xl font-bold">{formatValue(total)}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid w-full gap-2 text-xs">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              {section.title}
            </span>
            <span className="font-semibold">{formatValue(section.data.total ?? section.data.applications ?? 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const defaults = useMemo(() => getDefaultRange(), []);
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = buildQuery(from, to);
        const [dashboard, candidates, applications, familyRequests, placements, finance] =
          await Promise.all([
            apiFetch<GenericReport>(`/reports/dashboard?${query}`),
            apiFetch<GenericReport>(`/reports/candidates?${query}`),
            apiFetch<GenericReport>(`/reports/applications?${query}`),
            apiFetch<GenericReport>(`/reports/family-requests?${query}`),
            apiFetch<GenericReport>(`/reports/placements?${query}`),
            apiFetch<GenericReport>(`/reports/finance?${query}`)
          ]);

        if (mounted) {
          setSections([
            {
              id: "dashboard",
              title: "Operasyon",
              description: "Seçili tarihte genel CRM hacmi.",
              data: dashboard,
              color: "from-blue-500 to-cyan-400"
            },
            {
              id: "applications",
              title: "Başvurular",
              description: "Web sitesi ve manuel aday başvuru akışı.",
              data: applications,
              color: "from-cyan-500 to-emerald-400"
            },
            {
              id: "candidates",
              title: "Aday Havuzu",
              description: "Onay, red ve pasif aday dağılımı.",
              data: candidates,
              color: "from-emerald-500 to-lime-400"
            },
            {
              id: "family-requests",
              title: "Aile Talepleri",
              description: "Açık talepten yerleşmeye kadar durumlar.",
              data: familyRequests,
              color: "from-amber-500 to-orange-400"
            },
            {
              id: "placements",
              title: "Yerleştirmeler",
              description: "Başlangıç tarihine göre yerleştirme performansı.",
              data: placements,
              color: "from-violet-500 to-fuchsia-400"
            },
            {
              id: "finance",
              title: "Finans",
              description: "Fatura ve tahsilat görünümü.",
              data: finance,
              color: "from-rose-500 to-red-400"
            }
          ]);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Raporlar alınamadı.");
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
  }, [from, to]);

  const topCards = sections[0]
    ? Object.entries(sections[0].data).map(([key, value]) => ({ key, value }))
    : [];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Rapor Merkezi</p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">Tarih Bazlı Operasyon Raporları</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Başvuru, aday, aile talebi, yerleştirme ve finans metriklerini seçtiğiniz tarih aralığında izleyin.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs font-medium text-slate-600">
              Başlangıç
              <input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="mt-1 block rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Bitiş
              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="mt-1 block rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCards.map((card, index) => (
              <div key={card.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className={`h-1.5 rounded-full bg-gradient-to-r ${sections[index % sections.length]?.color}`} />
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                  {labels[card.key] ?? card.key}
                </p>
                <p className="mt-2 text-3xl font-bold">{formatValue(card.value)}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <Donut sections={sections.slice(1)} />
            <div className="grid gap-4 md:grid-cols-2">
              {sections.slice(1).map((section) => {
                const maxValue = Math.max(...Object.values(section.data).map((value) => Number(value) || 0), 1);

                return (
                  <section key={section.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{section.description}</p>
                      </div>
                      <span className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${section.color}`} />
                    </div>
                    <div className="mt-4 space-y-3">
                      {Object.entries(section.data).map(([key, value]) => {
                        const numeric = Number(value) || 0;
                        const ratio = Math.max(5, Math.round((numeric / maxValue) * 100));

                        return (
                          <div key={key}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-slate-600">{labels[key] ?? key}</span>
                              <span className="font-semibold">{formatValue(value)}</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${section.color}`}
                                style={{ width: `${ratio}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
