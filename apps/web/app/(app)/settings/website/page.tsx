"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type WebsiteDashboard = {
  pages: number;
  submissions: number;
  settings: number;
  logs: number;
};

type WebsiteContentRow = {
  id: string;
  type: string;
  slug: string | null;
  title: string;
  status: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string | null;
  payload: Record<string, unknown>;
  published_at: string | null;
  created_at: string;
};

type WebsiteSettingRow = {
  id: string;
  key: string;
  group: string;
  value: unknown;
};

type FormSubmissionRow = {
  id: string;
  form_type: string;
  status: string;
  source: string | null;
  crm_entity_type: string | null;
  crm_entity_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

type IntegrationLogRow = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type PageForm = {
  type: string;
  slug: string;
  title: string;
  status: string;
  hero_title: string;
  hero_subtitle: string;
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  robots: string;
  payload: string;
};

type SettingForm = {
  key: string;
  group: string;
  value: string;
};

type WebsiteImageForm = {
  hero: string;
  process: string;
  trust: string;
  blogDefault: string;
};

type MediaUploadTarget = keyof WebsiteImageForm | "logo";

type BrandContactForm = {
  brandName: string;
  tagline: string;
  logoUrl: string;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  callbackLabel: string;
};

const pageTypes = ["PAGE", "HOME", "SERVICE", "LOCATION", "BLOG_POST", "BLOG_CATEGORY", "FAQ", "TESTIMONIAL", "NAVIGATION"];
const pageStatuses = ["DRAFT", "PUBLISHED", "SCHEDULED"];

const defaultWebsiteImages: WebsiteImageForm = {
  hero: "/images/site/premium-hero.png",
  process: "/images/site/premium-process.png",
  trust: "/images/site/premium-trust.png",
  blogDefault: "/images/site/premium-process.png"
};

const websiteImageFields: Array<{ key: keyof WebsiteImageForm; label: string; hint: string }> = [
  { key: "hero", label: "Ana Sayfa Hero", hint: "İlk ekranda görünen büyük görsel. Öneri: 1920x1080 yatay." },
  { key: "process", label: "Süreç / Danışmanlık", hint: "Danışmanlık ve eşleştirme bölümlerinde kullanılır." },
  { key: "trust", label: "Güven / Aday", hint: "Güven, hizmet ve aday bölümlerinde kullanılır." },
  { key: "blogDefault", label: "Blog Varsayılan", hint: "Blog üst görseli için yedek görsel." }
];

const defaultBrandContact: BrandContactForm = {
  brandName: "Dadı Kapıda",
  tagline: "Güven odaklı yerleştirme",
  logoUrl: "",
  supportEmail: "iletisim@dadikapida.com",
  phone: "",
  whatsapp: "",
  callbackLabel: "Geri arama talebi"
};

function previewImageSrc(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("/")) {
    const siteUrl = typeof window !== "undefined"
      ? window.location.origin.replace("crm.", "")
      : "https://dadikapida.com";
    return `${siteUrl}${trimmed}`;
  }
  return trimmed;
}

function prettyJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2);
}

function parseJson(value: string) {
  if (!value.trim()) return {};
  return JSON.parse(value);
}

function buildPageForm(page?: WebsiteContentRow): PageForm {
  return {
    type: page?.type ?? "PAGE",
    slug: page?.slug ?? "",
    title: page?.title ?? "",
    status: page?.status ?? "DRAFT",
    hero_title: page?.hero_title ?? "",
    hero_subtitle: page?.hero_subtitle ?? "",
    seo_title: page?.seo_title ?? "",
    meta_description: page?.meta_description ?? "",
    canonical_url: page?.canonical_url ?? "",
    robots: page?.robots ?? "",
    payload: prettyJson(page?.payload)
  };
}

function buildSettingForm(setting?: WebsiteSettingRow): SettingForm {
  return {
    key: setting?.key ?? "",
    group: setting?.group ?? "global",
    value: prettyJson(setting?.value)
  };
}

function buildWebsiteImageForm(setting?: WebsiteSettingRow): WebsiteImageForm {
  const value = setting?.value && typeof setting.value === "object" ? setting.value as Partial<WebsiteImageForm> : {};
  return {
    hero: typeof value.hero === "string" && value.hero.trim() ? value.hero : defaultWebsiteImages.hero,
    process: typeof value.process === "string" && value.process.trim() ? value.process : defaultWebsiteImages.process,
    trust: typeof value.trust === "string" && value.trust.trim() ? value.trust : defaultWebsiteImages.trust,
    blogDefault: typeof value.blogDefault === "string" && value.blogDefault.trim() ? value.blogDefault : defaultWebsiteImages.blogDefault
  };
}

function buildBrandContactForm(brandSetting?: WebsiteSettingRow, contactSetting?: WebsiteSettingRow): BrandContactForm {
  const brand = brandSetting?.value && typeof brandSetting.value === "object" ? brandSetting.value as Partial<BrandContactForm> : {};
  const contact = contactSetting?.value && typeof contactSetting.value === "object" ? contactSetting.value as Partial<BrandContactForm> : {};

  return {
    brandName: typeof brand.brandName === "string" && brand.brandName.trim() ? brand.brandName : defaultBrandContact.brandName,
    tagline: typeof brand.tagline === "string" && brand.tagline.trim() ? brand.tagline : defaultBrandContact.tagline,
    logoUrl: typeof brand.logoUrl === "string" ? brand.logoUrl : defaultBrandContact.logoUrl,
    supportEmail: typeof contact.supportEmail === "string" && contact.supportEmail.trim() ? contact.supportEmail : defaultBrandContact.supportEmail,
    phone: typeof contact.phone === "string" ? contact.phone : defaultBrandContact.phone,
    whatsapp: typeof contact.whatsapp === "string" ? contact.whatsapp : defaultBrandContact.whatsapp,
    callbackLabel: typeof contact.callbackLabel === "string" && contact.callbackLabel.trim() ? contact.callbackLabel : defaultBrandContact.callbackLabel
  };
}

export default function WebsiteSettingsPage() {
  const [dashboard, setDashboard] = useState<WebsiteDashboard | null>(null);
  const [pages, setPages] = useState<WebsiteContentRow[]>([]);
  const [settings, setSettings] = useState<WebsiteSettingRow[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmissionRow[]>([]);
  const [logs, setLogs] = useState<IntegrationLogRow[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedSettingKey, setSelectedSettingKey] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState<PageForm>(buildPageForm());
  const [settingForm, setSettingForm] = useState<SettingForm>(buildSettingForm());
  const [imageForm, setImageForm] = useState<WebsiteImageForm>(defaultWebsiteImages);
  const [brandContactForm, setBrandContactForm] = useState<BrandContactForm>(defaultBrandContact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState<MediaUploadTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPagePayload, setShowPagePayload] = useState(false);

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? null,
    [pages, selectedPageId]
  );
  const selectedSetting = useMemo(
    () => settings.find((setting) => setting.key === selectedSettingKey) ?? null,
    [settings, selectedSettingKey]
  );
  const websiteImageSetting = useMemo(
    () => settings.find((setting) => setting.key === "website.images"),
    [settings]
  );
  const websiteBrandSetting = useMemo(
    () => settings.find((setting) => setting.key === "website.brand"),
    [settings]
  );
  const globalContactSetting = useMemo(
    () => settings.find((setting) => setting.key === "global.contact"),
    [settings]
  );

  const load = async () => {
    const [dashboardData, pageData, settingData, submissionData, logData] = await Promise.all([
      apiFetch<WebsiteDashboard>("/api/v1/admin/website/dashboard"),
      apiFetch<WebsiteContentRow[]>("/api/v1/admin/website/pages"),
      apiFetch<WebsiteSettingRow[]>("/api/v1/admin/website/settings"),
      apiFetch<FormSubmissionRow[]>("/api/v1/admin/website/form-submissions"),
      apiFetch<IntegrationLogRow[]>("/api/v1/admin/website/integration-logs")
    ]);

    setDashboard(dashboardData);
    setPages(pageData);
    setSettings(settingData);
    setSubmissions(submissionData);
    setLogs(logData);

    const firstPage = pageData[0];
    const firstSetting = settingData[0];

    if (!selectedPageId && firstPage) {
      setSelectedPageId(firstPage.id);
    }
    if (!selectedSettingKey && firstSetting) {
      setSelectedSettingKey(firstSetting.key);
    }
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        await load();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Website ayarları alınamadı.");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPageForm(buildPageForm(selectedPage ?? undefined));
  }, [selectedPage]);

  useEffect(() => {
    setSettingForm(buildSettingForm(selectedSetting ?? undefined));
  }, [selectedSetting]);

  useEffect(() => {
    setImageForm(buildWebsiteImageForm(websiteImageSetting));
  }, [websiteImageSetting]);

  useEffect(() => {
    setBrandContactForm(buildBrandContactForm(websiteBrandSetting, globalContactSetting));
  }, [websiteBrandSetting, globalContactSetting]);

  const refresh = async () => {
    await load();
  };

  const savePage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setInfo(null);

      const payload = {
        type: pageForm.type,
        slug: pageForm.slug || undefined,
        title: pageForm.title,
        status: pageForm.status,
        hero_title: pageForm.hero_title || undefined,
        hero_subtitle: pageForm.hero_subtitle || undefined,
        payload: parseJson(pageForm.payload),
        seo_title: pageForm.seo_title || undefined,
        meta_description: pageForm.meta_description || undefined,
        canonical_url: pageForm.canonical_url || undefined,
        robots: pageForm.robots || undefined
      };

      if (selectedPage) {
        await apiFetch(`/api/v1/admin/website/pages/${selectedPage.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        setInfo("Sayfa güncellendi.");
      } else {
        const created = await apiFetch<WebsiteContentRow>("/api/v1/admin/website/pages", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setSelectedPageId(created.id);
        setInfo("Sayfa oluşturuldu.");
      }

      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sayfa kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async () => {
    if (!selectedPage) return;
    if (!window.confirm(`"${selectedPage.title}" sayfası silinsin mi?`)) return;

    try {
      setSaving(true);
      setError(null);
      await apiFetch(`/api/v1/admin/website/pages/${selectedPage.id}`, { method: "DELETE" });
      setSelectedPageId(null);
      setPageForm(buildPageForm());
      await refresh();
      setInfo("Sayfa silindi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sayfa silinemedi.");
    } finally {
      setSaving(false);
    }
  };

  const saveSetting = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setInfo(null);

      await apiFetch("/api/v1/admin/website/settings", {
        method: "PATCH",
        body: JSON.stringify({
          key: settingForm.key,
          group: settingForm.group,
          value: parseJson(settingForm.value)
        })
      });

      await refresh();
      setInfo("Site ayarı güncellendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ayar kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const saveWebsiteImages = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setInfo(null);

      await apiFetch("/api/v1/admin/website/settings", {
        method: "PATCH",
        body: JSON.stringify({
          key: "website.images",
          group: "website",
          value: imageForm
        })
      });

      await refresh();
      setInfo("Site fotoğrafları güncellendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fotoğraflar kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const uploadWebsiteMedia = async (target: MediaUploadTarget, file: File | null) => {
    if (!file) return;

    try {
      setUploadingMedia(target);
      setError(null);
      setInfo(null);

      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/website-media", {
        method: "POST",
        body
      });
      const payload = (await response.json()) as { path?: string; error?: string };

      if (!response.ok || !payload.path) {
        throw new Error(payload.error ?? "Gorsel yuklenemedi.");
      }

      if (target === "logo") {
        setBrandContactForm((prev) => ({ ...prev, logoUrl: payload.path ?? "" }));
      } else {
        setImageForm((prev) => ({ ...prev, [target]: payload.path ?? "" }));
      }

      setInfo("Gorsel yuklendi. Degisikligin sitede gorunmesi icin kaydetmeyi unutma.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gorsel yuklenemedi.");
    } finally {
      setUploadingMedia(null);
    }
  };

  const saveBrandContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setInfo(null);

      await Promise.all([
        apiFetch("/api/v1/admin/website/settings", {
          method: "PATCH",
          body: JSON.stringify({
            key: "website.brand",
            group: "website",
            value: {
              brandName: brandContactForm.brandName,
              tagline: brandContactForm.tagline,
              logoUrl: brandContactForm.logoUrl
            }
          })
        }),
        apiFetch("/api/v1/admin/website/settings", {
          method: "PATCH",
          body: JSON.stringify({
            key: "global.contact",
            group: "global",
            value: {
              supportEmail: brandContactForm.supportEmail,
              phone: brandContactForm.phone,
              whatsapp: brandContactForm.whatsapp,
              callbackLabel: brandContactForm.callbackLabel
            }
          })
        })
      ]);

      await refresh();
      setInfo("Marka ve iletişim bilgileri güncellendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Marka bilgileri kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Website Yönetimi</p>
        <h2 className="mt-2 text-2xl font-bold">CMS ve içerik kontrol merkezi</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Site ayarları, sayfalar, form kayıtları ve entegrasyon logları tek ekranda.
        </p>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {info ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{info}</p> : null}

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}

      {dashboard ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Sayfa", dashboard.pages],
            ["Form", dashboard.submissions],
            ["Ayar", dashboard.settings],
            ["Log", dashboard.logs]
          ].map(([label, value]) => (
            <div key={label} className="surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
              <p className="mt-2 text-3xl font-bold text-[var(--ink)]">{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <section className="surface rounded-2xl p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Marka ve İletişim</h3>
            <p className="text-sm text-[var(--muted)]">
              Logo, marka adı, slogan ve iletişim bilgilerini basitçe düzenle.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBrandContactForm(defaultBrandContact)}
            className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)]"
          >
            Varsayılana Dön
          </button>
        </div>

        <form onSubmit={saveBrandContact} className="mt-4 grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Marka Adı</span>
              <input value={brandContactForm.brandName} onChange={(e) => setBrandContactForm((prev) => ({ ...prev, brandName: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Kısa Slogan</span>
              <input value={brandContactForm.tagline} onChange={(e) => setBrandContactForm((prev) => ({ ...prev, tagline: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" />
            </label>
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Logo Yolu / URL</span>
              <input value={brandContactForm.logoUrl} onChange={(e) => setBrandContactForm((prev) => ({ ...prev, logoUrl: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" placeholder="/images/logo.png" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                onChange={(event) => {
                  void uploadWebsiteMedia("logo", event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
                className="mt-2 block w-full text-xs text-[var(--muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[#eef5ff] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[var(--brand)]"
              />
              {uploadingMedia === "logo" ? <span className="block text-xs text-[var(--muted)]">Logo yukleniyor...</span> : null}
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">E-posta</span>
              <input value={brandContactForm.supportEmail} onChange={(e) => setBrandContactForm((prev) => ({ ...prev, supportEmail: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Telefon</span>
              <input value={brandContactForm.phone} onChange={(e) => setBrandContactForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" placeholder="+90..." />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">WhatsApp</span>
              <input value={brandContactForm.whatsapp} onChange={(e) => setBrandContactForm((prev) => ({ ...prev, whatsapp: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" placeholder="+90..." />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Geri Arama Metni</span>
              <input value={brandContactForm.callbackLabel} onChange={(e) => setBrandContactForm((prev) => ({ ...prev, callbackLabel: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" />
            </label>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={saving} className="rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white">
                {saving ? "Kaydediliyor..." : "Marka Bilgilerini Kaydet"}
              </button>
              <p className="text-xs text-[var(--muted)]">Logo boş bırakılırsa DK yazılı varsayılan işaret görünür.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">Logo Önizleme</p>
            <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-[var(--line)] bg-slate-50">
              {brandContactForm.logoUrl ? (
                <img src={previewImageSrc(brandContactForm.logoUrl)} alt="Logo önizleme" className="max-h-28 max-w-44 object-contain" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900 text-lg font-bold text-white">DK</div>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="surface rounded-2xl p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Site Fotoğrafları</h3>
            <p className="text-sm text-[var(--muted)]">
              Public sitedeki ana görselleri kod bilmeden değiştir. Şimdilik görsel yolu veya URL girilir; örnek: /images/site/premium-hero.png
            </p>
          </div>
          <button
            type="button"
            onClick={() => setImageForm(defaultWebsiteImages)}
            className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)]"
          >
            Varsayılana Dön
          </button>
        </div>

        <form onSubmit={saveWebsiteImages} className="mt-4 grid gap-4 lg:grid-cols-2">
          {websiteImageFields.map((field) => (
            <label key={field.key} className="rounded-2xl border border-[var(--line)] bg-white p-4 text-sm">
              <span className="font-semibold text-[var(--ink)]">{field.label}</span>
              <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{field.hint}</span>
              <input
                value={imageForm[field.key]}
                onChange={(event) => setImageForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                className="mt-3 w-full rounded-xl border border-[var(--line)] px-3 py-2.5"
                placeholder="/images/site/premium-hero.png"
              />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                onChange={(event) => {
                  void uploadWebsiteMedia(field.key, event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
                className="mt-2 block w-full text-xs text-[var(--muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[#eef5ff] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[var(--brand)]"
              />
              {uploadingMedia === field.key ? <span className="mt-1 block text-xs text-[var(--muted)]">Gorsel yukleniyor...</span> : null}
              <div className="mt-3 overflow-hidden rounded-xl border border-[var(--line)] bg-slate-50">
                {imageForm[field.key] ? (
                  <img
                    src={previewImageSrc(imageForm[field.key])}
                    alt={`${field.label} önizleme`}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-xs text-[var(--muted)]">Görsel yolu girilmedi.</div>
                )}
              </div>
            </label>
          ))}

          <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white">
              {saving ? "Kaydediliyor..." : "Fotoğrafları Kaydet"}
            </button>
            <p className="text-xs text-[var(--muted)]">
              Kaydettikten sonra public site bu ayarı API üzerinden okur. CDN/cache varsa birkaç dakika gecikme olabilir.
            </p>
          </div>
        </form>
      </section>

      <section className="surface rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Sayfalar</h3>
            <p className="text-sm text-[var(--muted)]">Sayfa başlığı, SEO ve yayın durumunu düzenle.</p>
          </div>
          <button
            type="button"
            className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)]"
            onClick={() => { setSelectedPageId(null); setPageForm(buildPageForm()); setShowPagePayload(false); }}
          >
            + Yeni Sayfa
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => { setSelectedPageId(page.id); setShowPagePayload(false); }}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  selectedPageId === page.id ? "border-[var(--brand)] bg-[#eef5ff]" : "border-[var(--line)] bg-white hover:border-[#9dc3ec]"
                }`}
              >
                <span className="block text-xs text-[var(--muted)]">{page.status === "PUBLISHED" ? "✓ Yayında" : "Taslak"}</span>
                <span className="mt-1 block text-sm font-semibold text-[var(--ink)]">{page.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">/{page.slug ?? "—"}</span>
              </button>
            ))}
            {pages.length === 0 ? <p className="text-sm text-[var(--muted)]">Henüz sayfa yok.</p> : null}
          </div>

          <form onSubmit={savePage} className="space-y-3 rounded-2xl border border-[var(--line)] bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Durum</span>
                <select value={pageForm.status} onChange={(e) => setPageForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5">
                  <option value="DRAFT">Taslak</option>
                  <option value="PUBLISHED">Yayında</option>
                  <option value="SCHEDULED">Zamanlanmış</option>
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">URL (slug)</span>
                <input value={pageForm.slug} onChange={(e) => setPageForm((prev) => ({ ...prev, slug: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" placeholder="iletisim" />
              </label>
            </div>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Sayfa Başlığı</span>
              <input value={pageForm.title} onChange={(e) => setPageForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" placeholder="İletişim" />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Üst Bölüm Başlığı</span>
              <input value={pageForm.hero_title} onChange={(e) => setPageForm((prev) => ({ ...prev, hero_title: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Üst Bölüm Açıklaması</span>
              <textarea value={pageForm.hero_subtitle} onChange={(e) => setPageForm((prev) => ({ ...prev, hero_subtitle: e.target.value }))} className="min-h-16 w-full rounded-xl border border-[var(--line)] px-3 py-2.5" />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">SEO Başlığı <span className="font-normal text-[var(--muted)]">(Google'da görünen başlık)</span></span>
              <input value={pageForm.seo_title} onChange={(e) => setPageForm((prev) => ({ ...prev, seo_title: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5" />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">SEO Açıklaması <span className="font-normal text-[var(--muted)]">(Google sonuçlarında görünen açıklama)</span></span>
              <textarea value={pageForm.meta_description} onChange={(e) => setPageForm((prev) => ({ ...prev, meta_description: e.target.value }))} className="min-h-16 w-full rounded-xl border border-[var(--line)] px-3 py-2.5" />
            </label>
            <div>
              <button type="button" onClick={() => setShowPagePayload((v) => !v)} className="text-xs text-[var(--brand)] underline underline-offset-2">
                {showPagePayload ? "▲ Gelişmiş alanları gizle" : "▼ Gelişmiş alanları göster"}
              </button>
              {showPagePayload ? (
                <label className="mt-3 block space-y-1 text-sm">
                  <span className="font-medium">Payload JSON</span>
                  <textarea value={pageForm.payload} onChange={(e) => setPageForm((prev) => ({ ...prev, payload: e.target.value }))} className="min-h-40 w-full rounded-xl border border-[var(--line)] px-3 py-2.5 font-mono text-xs" />
                </label>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white">
                {saving ? "Kaydediliyor..." : selectedPage ? "Güncelle" : "Oluştur"}
              </button>
              {selectedPage ? (
                <button type="button" onClick={deletePage} disabled={saving} className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700">
                  Sil
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className="surface rounded-2xl p-4">
        <h3 className="text-lg font-semibold">Son Web Başvuruları</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Web sitesinden gelen son form başvuruları.</p>
        <div className="mt-4 space-y-2">
          {submissions.slice(0, 8).map((item) => {
            const typeLabel: Record<string, string> = {
              family_application: "Aile Başvurusu",
              nanny_application: "Personel Başvurusu",
              contact_request: "İletişim Talebi",
              callback_request: "Geri Arama Talebi",
              newsletter_subscription: "Bülten Aboneliği"
            };
            const statusLabel: Record<string, string> = {
              SYNCED: "İşlendi",
              NEW: "Yeni",
              REVIEWING: "İnceleniyor",
              FAILED: "Hata"
            };
            return (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{typeLabel[item.form_type] ?? item.form_type}</p>
                  <p className="text-xs text-[var(--muted)]">{new Date(item.created_at ?? "").toLocaleString("tr-TR")}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "SYNCED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {statusLabel[item.status] ?? item.status}
                </span>
              </div>
            );
          })}
          {submissions.length === 0 ? <p className="text-sm text-[var(--muted)]">Henüz web başvurusu yok.</p> : null}
        </div>
      </section>

      <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-semibold text-[var(--ink)]"
        >
          <span>Gelişmiş Ayarlar</span>
          <span className="text-[var(--muted)]">{showAdvanced ? "▲ Gizle" : "▼ Göster"}</span>
        </button>
        <p className="mt-1 text-xs text-[var(--muted)]">Teknik ayarlar — genellikle değiştirilmesi gerekmez.</p>

        {showAdvanced ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <section>
              <h4 className="mb-3 text-sm font-semibold">Ham Ayarlar (JSON)</h4>
              <form onSubmit={saveSetting} className="space-y-3 rounded-2xl border border-[var(--line)] bg-slate-50 p-4">
                <label className="block space-y-1 text-sm">
                  <span className="font-medium">Anahtar</span>
                  <input value={settingForm.key} onChange={(e) => setSettingForm((prev) => ({ ...prev, key: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5" placeholder="global.contact" />
                </label>
                <label className="block space-y-1 text-sm">
                  <span className="font-medium">Grup</span>
                  <input value={settingForm.group} onChange={(e) => setSettingForm((prev) => ({ ...prev, group: e.target.value }))} className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5" placeholder="global" />
                </label>
                <label className="block space-y-1 text-sm">
                  <span className="font-medium">Değer (JSON)</span>
                  <textarea value={settingForm.value} onChange={(e) => setSettingForm((prev) => ({ ...prev, value: e.target.value }))} className="min-h-40 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 font-mono text-xs" />
                </label>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white">{saving ? "Kaydediliyor..." : "Kaydet"}</button>
                  <button type="button" onClick={() => { setSelectedSettingKey(null); setSettingForm(buildSettingForm()); }} className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-[var(--ink)]">Temizle</button>
                </div>
              </form>
              <div className="mt-3 space-y-2">
                {settings.map((setting) => (
                  <button key={setting.id} type="button" onClick={() => setSelectedSettingKey(setting.key)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition ${selectedSettingKey === setting.key ? "border-[var(--brand)] bg-[#eef5ff]" : "border-[var(--line)] bg-white"}`}>
                    <span className="font-medium">{setting.key}</span>
                    <span className="ml-2 text-xs text-[var(--muted)]">{setting.group}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-sm font-semibold">Entegrasyon Logları</h4>
              <div className="space-y-2">
                {logs.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-xl border border-[var(--line)] bg-slate-50 px-3 py-2.5">
                    <p className="text-xs font-semibold text-[var(--ink)]">{item.action}</p>
                    <p className="text-xs text-[var(--muted)]">{new Date(item.created_at).toLocaleString("tr-TR")}</p>
                  </div>
                ))}
                {logs.length === 0 ? <p className="text-sm text-[var(--muted)]">Log kaydı yok.</p> : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
