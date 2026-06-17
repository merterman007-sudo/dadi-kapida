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
  }
  if (step === 1) {
    if (!String(form.service_type).trim()) return "Hizmet tipi seçmelisiniz.";
  }
  return null;
}

export default function FamilyApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    service_type: "gunduzlu-dadi",
    start_date: "",
    working_hours: "",
    budget_min: "",
    budget_max: "",
    preferred_contact_channel: "phone",
    childrenCount: "1",
    notes: "",
    consent: false,
    marketing_consent: false,
    submitted_at: new Date().toISOString(),
    honeypot: "",
    idempotency_key: crypto.randomUUID()
  });

  const payload = useMemo(
    () => ({
      contact: {
        fullName: form.full_name,
        phone: form.phone,
        email: form.email,
        city: form.city,
        district: form.district
      },
      need: {
        serviceType: form.service_type,
        startDate: form.start_date,
        workingHours: form.working_hours,
        budgetMin: form.budget_min ? Number(form.budget_min) : undefined,
        budgetMax: form.budget_max ? Number(form.budget_max) : undefined,
        preferredContactChannel: form.preferred_contact_channel,
        childrenCount: Number(form.childrenCount || 0),
        notes: form.notes
      }
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
      const { childrenCount, budget_min, budget_max, ...application } = form;
      void childrenCount;
      const body = {
        ...application,
        start_date: form.start_date || undefined,
        budget_min: budget_min ? Number(budget_min) : undefined,
        budget_max: budget_max ? Number(budget_max) : undefined,
        payload
      };
      const result = await postPublic<{ nextStep: string }>("/api/v1/public/applications/family", {
        ...body
      });
      router.push(result.nextStep as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvuru gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["1. İletişim", "2. İhtiyaç", "3. Onay"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="surface rounded-[28px] p-6 md:p-8">
        <SectionLabel>Aile Başvurusu</SectionLabel>
        <SectionHeading
          as="h1"
          title="Aileniz için doğru desteği birlikte bulalım."
          subtitle="Başvurunuzu adım adım tamamlayın, danışman ekibimiz uygun adaylar için süreci başlatsın."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
            İhtiyacınıza uygun aday eşleştirmesi
          </div>
          <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
            Danışman eşliğinde kontrollü süreç
          </div>
          <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
            KVKK uyumlu başvuru akışı
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
                  placeholder="Örn: Ayşe Yılmaz"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                />
              </Field>
              <Field label="Telefon" required>
                <input
                  className={inputClass}
                  placeholder="0532 000 00 00"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </Field>
              <Field label="E-posta">
                <input
                  className={inputClass}
                  placeholder="ornek@email.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Şehir">
                  <input
                    className={inputClass}
                    placeholder="İstanbul"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </Field>
                <Field label="İlçe">
                  <input
                    className={inputClass}
                    placeholder="Beşiktaş"
                    value={form.district}
                    onChange={(e) => update("district", e.target.value)}
                  />
                </Field>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Hizmet Tipi" required>
                  <select
                    className={inputClass}
                    value={form.service_type}
                    onChange={(e) => update("service_type", e.target.value)}
                  >
                    <option value="gunduzlu-dadi">Gündüzlü Dadı</option>
                    <option value="yatili-dadi">Yatılı Dadı</option>
                    <option value="bebek-bakicisi">Bebek Bakıcısı</option>
                    <option value="cocuk-bakicisi">Çocuk Bakıcısı</option>
                    <option value="oyun-ablasi">Oyun Ablası</option>
                    <option value="gece-dadisi">Gece Dadısı</option>
                    <option value="yasli-bakicisi">Yaşlı Bakıcısı</option>
                    <option value="refakatci">Refakatçi</option>
                    <option value="evde-bakim">Evde Bakım</option>
                    <option value="hasta-bakicisi">Hasta Bakıcısı</option>
                    <option value="ameliyat-sonrasi-destek">Ameliyat Sonrası Destek</option>
                    <option value="gunluk-temizlik">Günlük Temizlik</option>
                    <option value="haftalik-temizlik">Haftalık Temizlik</option>
                    <option value="ofis-temizligi">Ofis Temizliği</option>
                    <option value="villa-temizligi">Villa Temizliği</option>
                    <option value="aile-soforu">Aile Şoförü</option>
                    <option value="ozel-sofor">Özel Şoför</option>
                    <option value="makam-soforu">Makam Şoförü</option>
                    <option value="ev-yardimcisi">Ev Yardımcısı</option>
                    <option value="asci">Aşçı</option>
                    <option value="kahya">Kahya</option>
                    <option value="camasirci">Çamaşırcı</option>
                    <option value="yabanci-dil-bilen-dadi">Yabancı Dil Bilen Dadı</option>
                  </select>
                </Field>
                <Field label="Başlangıç Tarihi">
                  <input
                    type="date"
                    className={inputClass}
                    value={form.start_date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => update("start_date", e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Tercih Edilen İletişim">
                  <select
                    className={inputClass}
                    value={form.preferred_contact_channel}
                    onChange={(e) => update("preferred_contact_channel", e.target.value)}
                  >
                    <option value="phone">Telefon</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">E-posta</option>
                  </select>
                </Field>
                <Field label="Çocuk Sayısı">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className={inputClass}
                    placeholder="1"
                    value={form.childrenCount}
                    onChange={(e) => update("childrenCount", e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Çalışma Saatleri">
                  <select
                    className={inputClass}
                    value={form.working_hours}
                    onChange={(e) => update("working_hours", e.target.value)}
                  >
                    <option value="">Seçiniz</option>
                    <option value="07:00 - 17:00">07:00 - 17:00</option>
                    <option value="08:00 - 18:00">08:00 - 18:00</option>
                    <option value="09:00 - 18:00">09:00 - 18:00</option>
                    <option value="09:00 - 19:00">09:00 - 19:00</option>
                    <option value="10:00 - 20:00">10:00 - 20:00</option>
                    <option value="20:00 - 08:00">20:00 - 08:00 (Gece)</option>
                    <option value="Yatılı">Yatılı</option>
                    <option value="Esnek / Görüşülecek">Esnek / Görüşülecek</option>
                  </select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Maaş Bütçesi Alt">
                    <input
                      className={inputClass}
                      placeholder="₺"
                      type="number"
                      min={0}
                      value={form.budget_min}
                      onChange={(e) => update("budget_min", e.target.value)}
                    />
                  </Field>
                  <Field label="Maaş Bütçesi Üst">
                    <input
                      className={inputClass}
                      placeholder="₺"
                      type="number"
                      min={0}
                      value={form.budget_max}
                      onChange={(e) => update("budget_max", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
              <Field label="Notlar ve Beklentiler">
                <textarea
                  className={`${inputClass} min-h-36 resize-none`}
                  placeholder="Çocuklarınızın yaşı, çalışma saatleri, özel ihtiyaçlar..."
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
                  <span>{payload.contact.fullName || "—"}</span>
                </div>
                <div className="flex justify-between rounded-xl bg-white px-4 py-2">
                  <span className="font-medium text-navy">Telefon</span>
                  <span>{payload.contact.phone || "—"}</span>
                </div>
                <div className="flex justify-between rounded-xl bg-white px-4 py-2">
                  <span className="font-medium text-navy">Hizmet</span>
                  <span>{payload.need.serviceType}</span>
                </div>
                {payload.need.startDate ? (
                  <div className="flex justify-between rounded-xl bg-white px-4 py-2">
                    <span className="font-medium text-navy">Başlangıç</span>
                    <span>{payload.need.startDate}</span>
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
                    <Link href="/kvkk-aydinlatma-metni" className="underline hover:text-navy">KVKK Aydınlatma Metni</Link> ve{" "}
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
                  <span>Hizmet güncellemeleri ve rehber içerikleri için iletişim almak istiyorum.</span>
                </label>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {step > 0 ? (
            <button
              type="button"
              className="btn-outline"
              onClick={goBack}
            >
              ← Geri
            </button>
          ) : null}
          {step < 2 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={goNext}
            >
              Devam →
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !form.consent}
              onClick={submit}
              className="btn-primary disabled:cursor-not-allowed"
            >
              {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
