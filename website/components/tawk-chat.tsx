"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const HIDE_PATHS = [
  "/aile-basvurusu",
  "/dadi-basvurusu",
  "/personel-basvurusu",
  "/iletisim",
  "/geri-aranma-talebi",
  "/tesekkurler"
];

type TawkApi = {
  hideWidget?: () => void;
  showWidget?: () => void;
  onLoad?: () => void;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
  }
}

export function TawkChat() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hidden = HIDE_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateViewport();

    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const syncWidgetVisibility = () => {
      if (hidden || isMobile) {
        window.Tawk_API?.hideWidget?.();
        return;
      }

      window.Tawk_API?.showWidget?.();
    };

    window.Tawk_API = window.Tawk_API ?? {};
    window.Tawk_API.onLoad = syncWidgetVisibility;
    syncWidgetVisibility();

    return () => {
      if (window.Tawk_API?.onLoad === syncWidgetVisibility) {
        delete window.Tawk_API.onLoad;
      }
    };
  }, [hidden, isMobile, mounted]);

  if (!mounted || hidden || isMobile) return null;

  return (
    <Script
      id="tawkto"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6a2478aef81b7b1c2d8ac579/1jqf7eqv3';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `
      }}
    />
  );
}
