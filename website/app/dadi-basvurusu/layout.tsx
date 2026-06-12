import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personel Başvurusu",
  description: "Dadı Kapıda personel başvurusu için güncel başvuru sayfasını kullanın.",
  alternates: {
    canonical: "https://dadikapida.com/personel-basvurusu"
  },
  robots: {
    index: false,
    follow: true
  }
};

export default function LegacyPersonnelApplicationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
