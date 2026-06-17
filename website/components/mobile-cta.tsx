"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDE_PATHS = [
  "/aile-basvurusu",
  "/dadi-basvurusu",
  "/personel-basvurusu",
  "/iletisim",
  "/geri-aranma-talebi",
  "/tesekkurler"
];

export function MobileCta() {
  const pathname = usePathname();

  if (HIDE_PATHS.some((path) => pathname.startsWith(path))) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line/80 bg-[rgba(253,250,245,0.97)] px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex gap-2">
        <Link
          href="/aile-basvurusu"
          className="flex-1 rounded-full bg-green py-3 text-center text-sm font-semibold text-white shadow-[0_10px_24px_rgba(233,24,91,0.24)] transition active:opacity-80"
        >
          Aile Başvurusu
        </Link>
        <Link
          href="/personel-basvurusu"
          className="flex-1 rounded-full border border-green bg-white py-3 text-center text-sm font-semibold text-ink transition active:opacity-80"
        >
          Personel Başvurusu
        </Link>
      </div>
    </div>
  );
}
