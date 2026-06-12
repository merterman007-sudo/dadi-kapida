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
  customStyle?: {
    zIndex?: number | string;
    visibility?: {
      desktop?: {
        position?: string;
        xOffset?: number | string;
        yOffset?: number | string;
      };
      mobile?: {
        position?: string;
        xOffset?: number | string;
        yOffset?: number | string;
      };
    };
  };
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
  }
}

export function TawkChat() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const hidden = HIDE_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const syncWidgetVisibility = () => {
      if (hidden) {
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
  }, [hidden, mounted]);

  if (!mounted || hidden) return null;

  return (
    <Script
      id="tawkto"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          Tawk_API.customStyle = {
            zIndex: '55 !important',
            visibility: {
              desktop: {
                position: 'br',
                xOffset: 20,
                yOffset: 20
              },
              mobile: {
                position: 'br',
                xOffset: 16,
                yOffset: 96
              }
            }
          };
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6a2478aef81b7b1c2d8ac579/1jqf7eqv3';
            s1.charset='UTF-8';
            s0.parentNode.insertBefore(s1,s0);
          })();
        `
      }}
    />
  );
}
