export const familyStatusLabels: Record<string, string> = {
  LEAD: "Yeni Başvuru",
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
  QUALIFIED: "Temel ihtiyaçları doğrulanmış, sürece alınmaya hazır aile.",
  ACTIVE: "Aktif talebi veya devam eden bir süreç adımı olan aile.",
  PASSIVE: "Şu an aktif talebi olmayan, beklemede tutulan aile.",
  BLACKLISTED: "Politika nedeniyle işlem yapılmayan aile."
};

export const applicationStatusLabels: Record<string, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  CONVERTED_TO_CANDIDATE: "Personel Profiline Dönüştürüldü",
  REJECTED: "Reddedildi",
  DUPLICATE: "Mükerrer"
};

export const candidateStatusLabels: Record<string, string> = {
  NEW: "Yeni",
  PRE_SCREEN: "Ön Değerlendirme",
  INTERVIEW: "Görüşme",
  REFERENCE_CHECK: "Referans Kontrolü",
  DOCUMENT_PENDING: "Evrak Bekleniyor",
  APPROVED: "Onaylandı",
  PASSIVE: "Pasif",
  REJECTED: "Reddedildi",
  BLACKLISTED: "Kara Liste"
};

export const meetingTypeLabels: Record<string, string> = {
  FAMILY_INTAKE: "Aile Ön Görüşmesi",
  CANDIDATE_INTERVIEW: "Personel Görüşmesi",
  FAMILY_CANDIDATE_MEETING: "Aile ve Personel Görüşmesi",
  FOLLOW_UP: "Takip Görüşmesi",
  REFERENCE_CALL: "Referans Görüşmesi"
};

export const meetingStatusLabels: Record<string, string> = {
  SCHEDULED: "Planlandı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi",
  NO_SHOW: "Katılım Olmadı"
};

export const referenceStatusLabels: Record<string, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  VERIFIED: "Doğrulandı",
  NEGATIVE: "Olumsuz",
  UNREACHABLE: "Ulaşılamadı"
};

export const workTypeLabels: Record<string, string> = {
  LIVE_IN: "Yatılı",
  DAYTIME: "Gündüzlü",
  NIGHT: "Gece",
  PART_TIME: "Yarı Zamanlı",
  FULL_TIME: "Tam Zamanlı"
};

export const publicWorkTypeLabels: Record<string, string> = {
  gunduzlu: "Gündüzlü",
  yatili: "Yatılı",
  "her-ikisi": "Her ikisi de uygun",
  "part-time": "Yarı Zamanlı"
};

export const positionLabels: Record<string, string> = {
  dadi: "Dadı",
  "bebek-bakicisi": "Bebek Bakıcısı",
  "cocuk-bakicisi": "Çocuk Bakıcısı",
  "oyun-ablasi": "Oyun Ablası",
  "gece-dadisi": "Gece Dadısı",
  "yasli-bakicisi": "Yaşlı Bakıcısı",
  "hasta-bakicisi": "Hasta Bakıcısı",
  refakatci: "Refakatçi",
  "temizlik-personeli": "Temizlik Personeli",
  sofor: "Şoför",
  asci: "Aşçı",
  "ev-yardimcisi": "Ev Yardımcısı",
  kahya: "Kahya",
  camasirci: "Çamaşırcı"
};

export const messageChannelLabels: Record<string, string> = {
  WEBSITE: "Web Sitesi",
  WHATSAPP: "WhatsApp",
  SMS: "SMS",
  EMAIL: "E-posta",
  PHONE: "Telefon"
};

export const messageDirectionLabels: Record<string, string> = {
  INBOUND: "Gelen",
  OUTBOUND: "Giden"
};
