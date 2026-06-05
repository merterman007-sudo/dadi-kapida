export const familyStatusLabels: Record<string, string> = {
  LEAD: "Lead",
  QUALIFIED: "Nitelikli",
  ACTIVE: "Aktif",
  PASSIVE: "Pasif",
  BLACKLISTED: "Kara Liste"
};

export const familyRequestStatusLabels: Record<string, string> = {
  DRAFT: "Taslak",
  OPEN: "Açık",
  MATCHING: "Eşleştirme",
  SHORTLISTED: "Kısa Liste",
  INTERVIEWING: "Görüşme",
  OFFER: "Teklif",
  PLACED: "Yerleşti",
  CANCELLED: "İptal",
  LOST: "Kaybedildi"
};

export const familyStatusDescriptions: Record<string, string> = {
  LEAD: "Yeni gelen, henüz yeterince doğrulanmamış potansiyel aile.",
  QUALIFIED: "Temel ihtiyaçları doğrulanmış, süreçe alınmaya hazır aile.",
  ACTIVE: "Aktif talebi veya devam eden bir süreç adımı olan aile.",
  PASSIVE: "Şu an aktif talebi olmayan, beklemede tutulan aile.",
  BLACKLISTED: "Politika nedeniyle işlem yapılmayan aile."
};
