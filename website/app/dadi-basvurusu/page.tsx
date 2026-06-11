"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { postPublic } from "../../lib/api";
import { FormProgress } from "../../components/form-progress";
import { SectionLabel, SectionHeading } from "../../components/page-chrome";

type Step = 0 | 1 | 2;

const inputClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-navy placeholder:text-muted/60 outline-none focus:border-trust focus:ring-2 focus:ring-trust/20 transition";
const labelClass = "block text-xs font-semibold uppercase tracking-[0.14em] text-trust mb-1.5";
const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

const positionOptions = [
  { value: "", label: "Seçiniz" },
  { value: "dadi", label: "Dadı" },
  { value: "bebek-bakicisi", label: "Bebek Bakıcısı" },
  { value: "cocuk-bakicisi", label: "Çocuk Bakıcısı" },
  { value: "oyun-ablasi", label: "Oyun Ablası" },
  { value: "gece-dadisi", label: "Gece Dadısı" },
  { value: "yasli-bakicisi", label: "Yaşlı Bakıcısı" },
  { value: "hasta-bakicisi", label: "Hasta Bakıcısı" },
  { value: "refakatci", label: "Refakatçi" },
  { value: "temizlik-personeli", label: "Temizlik Personeli" },
  { value: "sofor", label: "Şoför" },
  { value: "asci", label: "Aşçı" },
  { value: "ev-yardimcisi", label: "Ev Yardımcısı" },
  { value: "kahya", label: "Kahya" },
  { value: "camasirci", label: "Çamaşırcı" }
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? requiredStar : null}
      </label>
      {children}
    </div>
  );
}

function validateStep(step: Step, form: Record<string, string | boolean>): string | null {
  if (step === 0) {
    if (!String(form.full_name).trim()) return "Ad soyad zorunludur.";
    if (!String(form.phone).trim()) return "Telefon numarası zorunludur.";
    if (String(form.phone).replace(/\D/g, "").length < 10) return "Geçerli bir telefon numarası girin.";
    if (!String(form.applied_position).trim()) return "Başvurmak istediğiniz pozisyonu seçin.";
  }
  if (step === 1) {
    if (!String(form.birth_date).trim()) return "Doğum tarihi zorunludur.";
    if (!String(form.city).trim()) return "Şehir zorunludur.";
  }
  return null;
}

export default function NannyApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    applied_position: "",
    birth_date: "",
    city: "",
    district: "",
    experience_years: "",
    work_type: "",
    source: "WEBSITE",
    notes: "",
    consent: false,
    marketing_consent: false,
    submitted_at: new Date().toISOString(),
    honeypot: "",
    idempotency_key: crypto.randomUUID()
  });

  const payload = useMemo(
    () => ({
      personal: {
        fullName: form.full_name,
        phone: form.phone,
        email: form.email,
        birthDate: form.birth_date,
        city: form.city,
        district: form.district
      },
      application: {
        appliedPosition: form.applied_position
      },
      experience: {
        years: form.experience_years,
        workType: form.work_type
      },
      notes: form.notes
    }),
    [form]
  );

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const goNext = () => {
    const validationError = validateStep(step, form as unknown as Record<string, string | boolean>);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCompletedSteps((prev) => new Set([...prev, step]));
    setStep((prev) => (prev + 1) as Step);
  };

  const goBack = () => {
    setError(null);
    setStep((prev) => (prev - 1) as Step);
  };

  const goToStep = (index: number) => {
    if (index <= step || completedSteps.has(index)) {
      setError(null);
      setStep(index as Step);
    }
  };

  const submit = async () => {
    if (!form.consent) {
      setError("KVKK metnini onaylamanız gereklidir.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { experience_years, work_type, notes, ...application } = form;
      void experience_years;
      void work_type;
      void notes;
      const result = await postPublic<{ nextStep: string }>("/api/v1/public/applications/nanny", {
        ...application,
        payload
      });
      router.push(result.nextStep as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvuru gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["1. Uygunluk", "2. Bilgiler", "3. Onay"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="surface rounded-[28px] p-6 md:p-8">
        <SectionLabel>Personel Başvurusu</SectionLabel>
        <SectionHeading
          title="Profesyonel personel adayları için saygılı ve güvenilir süreç."
          subtitle="Başvurular değerlendirme sürecine alınır. Başvuru yapmak işe yerleşme garantisi oluşturmaz."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
            Referans ve deneyim değerlendirmesi
          </div>
          <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
            Uygun aile eşleşmesi için inceleme
          </div>
          <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
            Gerekli olduğunda danışman geri dönüşü
          </div>
        </div>

        {/* Step indicator */}
        <div className="mt-6">
          <FormProgress
            steps={stepLabels}
            current={step}
            completedSteps={completedSteps}
            onGoTo={goToStep}
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {step === 0 ? (
            <>
              <Field label="Ad Soyad" required>
                <input
                  className={inputClass}
                  placeholder="Örn: Fatma Demir"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Telefon" required>
                  <input
                    type="tel"
                    className={inputClass}
                    placeholder="0532 000 00 00"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </Field>
                <Field label="E-posta">
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="ornek@email.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Başvurmak İstediğiniz Pozisyon" required>
                <select
                  className={inputClass}
                  value={form.applied_position}
                  onChange={(e) => update("applied_position", e.target.value)}
                >
                  {positionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Doğum Tarihi" required>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.birth_date}
                    max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    onChange={(e) => update("birth_date", e.target.value)}
                  />
                </Field>
                <Field label="Şehir" required>
                  <input
                    className={inputClass}
                    placeholder="İstanbul"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="İlçe">
                  <input
                    className={inputClass}
                    placeholder="Kadıköy"
                    value={form.district}
                    onChange={(e) => update("district", e.target.value)}
                  />
                </Field>
                <Field label="Deneyim (Yıl)">
                  <select
                    className={inputClass}
                    value={form.experience_years}
                    onChange={(e) => update("experience_years", e.target.value)}
                  >
                    <option value="">Seçiniz</option>
                    <option value="0">Deneyimsiz / Yeni başlıyorum</option>
                    <option value="1">1 yıl</option>
                    <option value="2">2 yıl</option>
                    <option value="3-5">3–5 yıl</option>
                    <option value="5+">5 yıl ve üzeri</option>
                  </select>
                </Field>
              </div>
              <Field label="Tercih Edilen Çalışma Tipi">
                <select
                  className={inputClass}
                  value={form.work_type}
                  onChange={(e) => update("work_type", e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  <option value="gunduzlu">Gündüzlü</option>
                  <option value="yatili">Yatılı</option>
                  <option value="her-ikisi">Her ikisi de uygun</option>
                  <option value="part-time">Part-time</option>
                </select>
              </Field>
              <Field label="Kendinizi Tanıtın">
                <textarea
                  className={`${inputClass} min-h-36 resize-none`}
                  placeholder="Deneyimlerinizi, referanslarınızı ve çalışma beklentilerinizi kısaca yazın..."
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />
              </Field>
            </>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4 rounded-[24px] border border-line bg-ivory p-5">
              <p className="text-sm font-semibold text-navy">Başvuru Özeti</p>
              <div className="grid gap-2 text-sm text-muted">
                <div className="flex justify-between rounded-xl bg-white px-4 py-2">
                  <span className="font-medium text-navy">Ad Soyad</span>
                  <span>{payload.personal.fullName || "—"}</span>
                </div>
                <div className="flex justify-between rounded-xl bg-white px-4 py-2">
                  <span className="font-medium text-navy">Telefon</span>
                  <span>{payload.personal.phone || "—"}</span>
                </div>
                <div className="flex justify-between rounded-xl bg-white px-4 py-2">
                  <span className="font-medium text-navy">Şehir</span>
                  <span>{payload.personal.city || "—"}</span>
                </div>
                {payload.experience.workType ? (
                  <div className="flex justify-between rounded-xl bg-white px-4 py-2">
                    <span className="font-medium text-navy">Çalışma Tipi</span>
                    <span>{payload.experience.workType}</span>
                  </div>
                ) : null}
              </div>
              <div className="mt-2 space-y-3 border-t border-line pt-4">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-0.5 h-4 w-4 cursor-pointer accent-trust"
                  />
                  <span>
                    <Link href="/aday-aydinlatma-metni" className="underline hover:text-navy">Aday Aydınlatma Metni</Link> ve{" "}
                    <Link href="/basvuru-sartlari" className="underline hover:text-navy">Başvuru Şartları</Link>&apos;nı okudum, onaylıyorum.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={form.marketing_consent}
                    onChange={(e) => update("marketing_consent", e.target.checked)}
                    className="mt-0.5 h-4 w-4 cursor-pointer accent-trust"
                  />
                  <span>Uygun pozisyonlar ve sektör haberleri için iletişim almak istiyorum.</span>
                </label>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {step > 0 ? (
            <button
              type="button"
              className="rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-navy hover:border-navy transition"
              onClick={goBack}
            >
              ← Geri
            </button>
          ) : null}
          {step < 2 ? (
            <button
              type="button"
              className="rounded-full bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-trust transition"
              onClick={goNext}
            >
              Devam →
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !form.consent}
              onClick={submit}
              className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-trust disabled:bg-slate-500 disabled:text-white disabled:cursor-not-allowed"
            >
              {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

