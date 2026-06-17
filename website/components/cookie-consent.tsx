"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_KEY = "dk_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage may not be available
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const reject = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "rejected");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-[72px] left-0 right-0 z-50 border-t border-line bg-[rgba(255,253,248,0.97)] backdrop-blur-xl px-4 py-4 shadow-[0_-8px_30px_rgba(17,37,31,0.10)] lg:bottom-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted max-w-2xl">
          Sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz. Devam ederek{" "}
          <Link href="/cerez-politikasi" className="underline hover:text-green">
            Çerez Politikamızı
          </Link>{" "}
          ve{" "}
          <Link href="/kvkk-aydinlatma-metni" className="underline hover:text-green">
            KVKK Aydınlatma Metnimizi
          </Link>{" "}
          kabul etmiş sayılırsınız.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-muted transition hover:border-green hover:text-green"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-green px-5 py-2 text-sm font-medium text-white transition hover:bg-[#BF1047]"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
