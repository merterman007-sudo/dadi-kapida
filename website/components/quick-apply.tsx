"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Tab = "family" | "nanny";

const selectClass =
  "w-full appearance-none bg-white text-sm text-ink outline-none placeholder:text-muted/60 cursor-pointer";

export function QuickApply() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("family");
  const [serviceType, setServiceType] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [workType, setWorkType] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = () => {
    if (tab === "family") {
      const params = new URLSearchParams();
      if (serviceType) params.set("service", serviceType);
      if (city) params.set("city", city);
      if (startDate) params.set("start", startDate);
      router.push(`/aile-basvurusu?${params.toString()}`);
    } else {
      const params = new URLSearchParams();
      if (workType) params.set("work_type", workType);
      if (city) params.set("city", city);
      if (experience) params.set("experience", experience);
      router.push(`/personel-basvurusu?${params.toString()}`);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
      {/* Sekmeler */}
      <div className="flex border-b border-line/60">
        <button
          type="button"
          onClick={() => setTab("family")}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition
            ${tab === "family"
              ? "border-b-2 border-navy bg-white text-navy"
              : "bg-white/80 text-muted hover:text-navy"}`}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Aile Başvurusu
        </button>
        <button
          type="button"
          onClick={() => setTab("nanny")}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition
            ${tab === "nanny"
              ? "border-b-2 border-navy bg-white text-navy"
              : "bg-white/80 text-muted hover:text-navy"}`}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 18c0-3 3-5.5 7-5.5s7 2.5 7 5.5M12 10.5l2 2-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Personel Başvurusu
        </button>
      </div>

      {/* Alanlar */}
      <div className="flex flex-col gap-0 lg:flex-row">
        {tab === "family" ? (
          <>
            {/* Hizmet tipi */}
            <div className="flex flex-1 flex-col border-b border-line/50 px-4 py-3.5 lg:border-b-0 lg:border-r">
              <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
                Hizmet Tipi
              </label>
              <select
                className={selectClass}
                value={serviceType}
                onChange={e => setServiceType(e.target.value)}
              >
                <option value="">Seçiniz...</option>
                <option value="gunduzlu-dadi">Gündüzlü Dadı</option>
                <option value="yatili-dadi">Yatılı Dadı</option>
                <option value="bebek-bakicisi">Bebek Bakıcısı</option>
                <option value="yenidogan-bakimi">Yenidoğan Bakımı</option>
                <option value="oyun-ablasi">Oyun Ablası</option>
                <option value="egitimli-dadi">Eğitimli Dadı</option>
                <option value="yabanci-dil-bilen-dadi">Yabancı Dil Bilen Dadı</option>
              </select>
            </div>

            {/* Şehir */}
            <div className="flex flex-1 flex-col border-b border-line/50 px-4 py-3.5 lg:border-b-0 lg:border-r">
              <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
                Şehir / İlçe
              </label>
              <input
                type="text"
                className={`${selectClass}`}
                placeholder="İstanbul, Beşiktaş..."
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            {/* Başlangıç tarihi */}
            <div className="flex flex-1 flex-col border-b border-line/50 px-4 py-3.5 lg:border-b-0 lg:border-r">
              <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
                Ne Zaman?
              </label>
              <input
                type="date"
                className={`${selectClass}`}
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            {/* Çalışma tipi */}
            <div className="flex flex-1 flex-col border-b border-line/50 px-4 py-3.5 lg:border-b-0 lg:border-r">
              <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
                Çalışma Tipi
              </label>
              <select
                className={selectClass}
                value={workType}
                onChange={e => setWorkType(e.target.value)}
              >
                <option value="">Seçiniz...</option>
                <option value="gunduzlu">Gündüzlü</option>
                <option value="yatili">Yatılı</option>
                <option value="her-ikisi">Her ikisi de uygun</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>

            {/* Şehir */}
            <div className="flex flex-1 flex-col border-b border-line/50 px-4 py-3.5 lg:border-b-0 lg:border-r">
              <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
                Şehir / İlçe
              </label>
              <input
                type="text"
                className={`${selectClass}`}
                placeholder="İstanbul, Kadıköy..."
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            {/* Deneyim */}
            <div className="flex flex-1 flex-col border-b border-line/50 px-4 py-3.5 lg:border-b-0 lg:border-r">
              <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
                Deneyim
              </label>
              <select
                className={selectClass}
                value={experience}
                onChange={e => setExperience(e.target.value)}
              >
                <option value="">Seçiniz...</option>
                <option value="0">Yeni başlıyorum</option>
                <option value="1">1 yıl</option>
                <option value="2">2 yıl</option>
                <option value="3-5">3–5 yıl</option>
                <option value="5+">5 yıl ve üzeri</option>
              </select>
            </div>
          </>
        )}

        {/* CTA Butonu */}
        <div className="flex items-stretch">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 bg-navy px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#163C2A] lg:rounded-none lg:w-auto"
          >
            {tab === "family" ? "Aile Başvurusu Yap" : "Personel Başvurusu Yap"}
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 7.5h11M9 3l4 4.5-4 4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
