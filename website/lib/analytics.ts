declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventName =
  | "family_application_start"
  | "family_application_step_complete"
  | "family_application_submit"
  | "nanny_application_start"
  | "nanny_application_step_complete"
  | "nanny_application_submit"
  | "callback_submit"
  | "contact_submit"
  | "whatsapp_click"
  | "cta_click"
  | "blog_cta_click"
  | "service_cta_click";

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(name: EventName, params?: EventParams): void {
  if (typeof window === "undefined") return;

  try {
    if (window.gtag) {
      window.gtag("event", name, params ?? {});
    }
    if (process.env.NODE_ENV === "development") {
      console.debug(`[Analytics] ${name}`, params);
    }
  } catch {
    // never throw from analytics
  }
}
