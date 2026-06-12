import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personel Başvurusu",
  description: "Dadı, bakıcı, temizlik personeli, şoför ve ev hizmetleri pozisyonları için profesyonel personel başvurunuzu oluşturun.",
  alternates: {
    canonical: "https://dadikapida.com/personel-basvurusu"
  }
};

export default function PersonnelApplicationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
