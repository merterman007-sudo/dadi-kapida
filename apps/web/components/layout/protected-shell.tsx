"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { useSessionStore } from "@/lib/session-store";

type IconName =
  | "dashboard"
  | "applications"
  | "candidates"
  | "families"
  | "requests"
  | "shortlists"
  | "notes"
  | "documents"
  | "references"
  | "meetings"
  | "tasks"
  | "placements"
  | "contracts"
  | "messages"
  | "finance"
  | "reports"
  | "audit"
  | "settings"
  | "website";

type MenuItem = {
  href: string;
  label: string;
  icon: IconName;
};

type SearchResult = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
};

type CandidateSearchRow = {
  id: string;
  candidate_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string | null;
  district: string | null;
  source: string | null;
  created_at: string;
};

type FamilySearchRow = {
  id: string;
  family_name: string;
  primary_contact_name: string;
  primary_contact_phone: string;
  city: string | null;
  district: string | null;
};

type FamilyRequestSearchRow = {
  id: string;
  title: string;
  status: string;
  city: string | null;
  district: string | null;
};

type ApplicationSearchRow = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  status: string;
};

const menu: readonly MenuItem[] = [
  { href: "/dashboard", label: "Panel", icon: "dashboard" },
  { href: "/applications", label: "Başvurular", icon: "applications" },
  { href: "/candidates", label: "Adaylar", icon: "candidates" },
  { href: "/families", label: "Aileler", icon: "families" },
  { href: "/family-requests", label: "Talepler", icon: "requests" },
  { href: "/shortlists", label: "Kısa Liste", icon: "shortlists" },
  { href: "/notes", label: "Notlar", icon: "notes" },
  { href: "/documents", label: "Evraklar", icon: "documents" },
  { href: "/references", label: "Referanslar", icon: "references" },
  { href: "/meetings", label: "Görüşmeler", icon: "meetings" },
  { href: "/tasks", label: "Görevler", icon: "tasks" },
  { href: "/placements", label: "Yerleştirmeler", icon: "placements" },
  { href: "/contracts", label: "Sözleşmeler", icon: "contracts" },
  { href: "/messages", label: "Mesajlar", icon: "messages" },
  { href: "/finance", label: "Finans", icon: "finance" },
  { href: "/reports", label: "Raporlar", icon: "reports" },
  { href: "/audit-logs", label: "Denetim Kaydı", icon: "audit" },
  { href: "/settings/users", label: "Ayarlar", icon: "settings" },
  { href: "/settings/website", label: "Site", icon: "website" }
] as const;

function resolveCreateHref(pathname: string): string {
  if (pathname.startsWith("/family-requests")) return "/family-requests/new";
  if (pathname.startsWith("/families")) return "/families/new";
  return "/candidates/new";
}

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase("tr");
}

function includesSearch(value: string, query: string): boolean {
  return value.toLocaleLowerCase("tr").includes(query);
}

function MenuIcon({ name }: { name: IconName }) {
  const common = "h-4 w-4";

  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M3 13h8V3H3zM13 21h8v-8h-8zM13 3h8v6h-8zM3 21h8v-6H3z" />
        </svg>
      );
    case "applications":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v5h5M10 12h6M10 16h6" />
        </svg>
      );
    case "candidates":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20c1.2-3 3.8-5 7-5s5.8 2 7 5" />
        </svg>
      );
    case "families":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <circle cx="8" cy="9" r="2.5" />
          <circle cx="16" cy="9" r="2.5" />
          <path d="M3.5 20c.8-2.6 2.8-4.5 5.5-4.5S13.7 17.4 14.5 20M11 20c.7-2.3 2.5-4 5-4 2.6 0 4.4 1.7 5 4" />
        </svg>
      );
    case "requests":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M4 5h16v10H4z" />
          <path d="M8 19h8M12 15v4" />
        </svg>
      );
    case "shortlists":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M5 7h14M5 12h10M5 17h8" />
          <path d="m16 16 2 2 3-4" />
        </svg>
      );
    case "notes":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M6 3h12v18H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case "documents":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M6 2h9l5 5v15H6z" />
          <path d="M15 2v5h5" />
        </svg>
      );
    case "references":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
          <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
        </svg>
      );
    case "meetings":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "tasks":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M8 6h12M8 12h12M8 18h12" />
          <path d="m3 6 1.5 1.5L6.5 5.5M3 12l1.5 1.5 2-2M3 18l1.5 1.5 2-2" />
        </svg>
      );
    case "placements":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M4 12h8" />
          <path d="m9 7 5 5-5 5" />
          <rect x="14" y="5" width="6" height="14" rx="1.5" />
        </svg>
      );
    case "contracts":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    case "messages":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "finance":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M12 3v18" />
          <path d="M17 7c0-1.7-2.2-3-5-3s-5 1.3-5 3 1.7 2.5 5 3 5 1.3 5 3-2.2 3-5 3-5-1.3-5-3" />
        </svg>
      );
    case "reports":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M4 19h16" />
          <rect x="6" y="11" width="2.5" height="6" />
          <rect x="10.75" y="8" width="2.5" height="9" />
          <rect x="15.5" y="5" width="2.5" height="12" />
        </svg>
      );
    case "audit":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M12 3 5 6v6c0 4.4 2.7 7.3 7 9 4.3-1.7 7-4.6 7-9V6z" />
          <path d="m9.5 12 1.8 1.8 3.2-3.2" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 0 1 0 4h-.1a1 1 0 0 0-.9.6z" />
        </svg>
      );
    case "website":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18" />
          <path d="M7 7h.01M10 7h.01M13 7h.01" />
          <path d="M7 13h5M7 16h9" />
        </svg>
      );
    default:
      return null;
  }
}

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useSessionStore((state) => state.accessToken);
  const setAccessToken = useSessionStore((state) => state.setAccessToken);
  const createHref = resolveCreateHref(pathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const persisted = window.localStorage.getItem("crm_access_token");
    if (!persisted) {
      router.replace("/login");
      return;
    }

    if (!token) {
      setAccessToken(persisted);
    }
  }, [router, setAccessToken, token]);

  useEffect(() => {
    const query = normalizeSearch(searchQuery);
    if (!token || query.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        setSearching(true);
        const [candidateResult, familyResult, requestResult, applicationResult] = await Promise.allSettled([
          apiFetch<CandidateSearchRow[]>(`/candidates?page=1&limit=5&q=${encodeURIComponent(query)}`),
          apiFetch<FamilySearchRow[]>(`/families?page=1&limit=5&q=${encodeURIComponent(query)}`),
          apiFetch<FamilyRequestSearchRow[]>(`/family-requests?page=1&limit=5&q=${encodeURIComponent(query)}`),
          apiFetch<ApplicationSearchRow[]>("/applications?page=1&limit=20")
        ]);

        if (cancelled) return;

        const next: SearchResult[] = [];

        if (candidateResult.status === "fulfilled") {
          next.push(
            ...candidateResult.value.map((candidate) => ({
              href: `/candidates/${candidate.id}`,
              eyebrow: "Aday",
              title: `${candidate.first_name} ${candidate.last_name} (${candidate.candidate_code})`,
              description: `${candidate.phone} · ${[candidate.city, candidate.district].filter(Boolean).join(" / ") || "Lokasyon yok"} · ${
                candidate.source ?? "Kaynak yok"
              }`
            }))
          );
        }

        if (familyResult.status === "fulfilled") {
          next.push(
            ...familyResult.value.map((family) => ({
              href: `/families/${family.id}`,
              eyebrow: "Aile",
              title: family.family_name,
              description: `${family.primary_contact_name} · ${family.primary_contact_phone} · ${[family.city, family.district].filter(Boolean).join(" / ") || "Lokasyon yok"}`
            }))
          );
        }

        if (requestResult.status === "fulfilled") {
          next.push(
            ...requestResult.value.map((request) => ({
              href: `/family-requests/${request.id}`,
              eyebrow: "Talep",
              title: request.title,
              description: `${request.status} · ${[request.city, request.district].filter(Boolean).join(" / ") || "Lokasyon yok"}`
            }))
          );
        }

        if (applicationResult.status === "fulfilled") {
          next.push(
            ...applicationResult.value
              .filter((application) =>
                includesSearch(
                  `${application.first_name} ${application.last_name} ${application.phone} ${application.email ?? ""}`,
                  query
                )
              )
              .slice(0, 5)
              .map((application) => ({
                href: `/applications/${application.id}`,
                eyebrow: "Başvuru",
                title: `${application.first_name} ${application.last_name}`,
                description: `${application.phone} · ${application.status}`
              }))
          );
        }

        setSearchResults(next.slice(0, 8));
      } catch {
        if (!cancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchQuery, token]);

  return (
    <div className="min-h-screen p-4 md:p-6" data-app-shell>
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
        <aside className="surface fade-up rounded-2xl p-4 md:p-5">
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/70 p-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Operasyon</p>
              <h1 className="mt-1 text-xl font-bold">Dadı Kapıda CRM</h1>
            </div>
            <div className="rounded-lg bg-[#e8f2ff] px-2 py-1 text-xs font-semibold text-[var(--brand)]">v1</div>
          </div>

          <nav className="space-y-1">
            {menu.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--brand)] text-white shadow-[0_10px_24px_rgba(11,107,203,0.3)]"
                      : "text-[var(--ink)] hover:bg-[#eef5ff]"
                  }`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${
                      active ? "bg-white/20 text-white" : "bg-[#e8f2ff] text-[var(--brand)]"
                    }`}
                  >
                    <MenuIcon name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="surface fade-up rounded-2xl">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-4 md:px-6">
            <div className="relative w-full max-w-xl">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Aday, aile, talep veya telefon ile ara"
                className="w-full rounded-xl border px-3 py-2.5 pl-10 text-sm outline-none transition focus:border-[#8dbcf0]"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                ARA
              </span>
              {searchQuery.trim().length >= 2 ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_18px_45px_rgba(8,40,94,0.16)]">
                  <div className="border-b border-[var(--line)] px-3 py-2 text-xs text-[var(--muted)]">
                    {searching ? "Aranıyor..." : `${searchResults.length} sonuç`}
                  </div>
                  <div className="max-h-80 overflow-auto p-2">
                    {searchResults.map((result) => (
                      <Link
                        key={`${result.eyebrow}-${result.href}`}
                        href={result.href}
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="block rounded-xl px-3 py-2 transition hover:bg-[#f3f8ff]"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
                          {result.eyebrow}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold">{result.title}</p>
                        <p className="mt-0.5 text-xs text-[var(--muted)]">{result.description}</p>
                      </Link>
                    ))}
                    {!searching && searchResults.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-[var(--muted)]">
                        Sonuç yok. İsim, telefon veya lokasyonla tekrar deneyin.
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/meetings" className="btn-ghost rounded-xl px-3 py-2 text-sm font-medium">
                Görüşme
              </Link>
              <Link href={createHref} className="btn-primary rounded-xl px-3 py-2 text-sm font-semibold">
                Yeni Oluştur
              </Link>
              <button
                className="btn-ghost rounded-xl px-3 py-2 text-sm font-medium"
                onClick={() => {
                  window.localStorage.removeItem("crm_access_token");
                  setAccessToken(null);
                  router.replace("/login");
                }}
              >
                Çıkış
              </button>
            </div>
          </header>
          <section className="p-4 md:p-6">{children}</section>
        </main>
      </div>
    </div>
  );
}
