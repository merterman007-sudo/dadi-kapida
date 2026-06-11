import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
      <span className="h-px w-5 bg-current opacity-60" />
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  subtitle,
  centered = false,
  light = false
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : ""}>
      <h2 className={`font-heading text-3xl font-semibold leading-tight sm:text-[2.2rem] ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle ? <p className={`mt-3 text-sm leading-7 ${light ? "text-white/75" : "text-muted"}`}>{subtitle}</p> : null}
    </div>
  );
}

export function Arrow({ white }: { white?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M2 7h10M8 3l4 4-4 4" stroke={white ? "white" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8C5368]/10">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6.5l2.5 2.5 5.5-5" stroke="#8C5368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

