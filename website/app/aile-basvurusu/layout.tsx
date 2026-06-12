import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aile Başvurusu",
  description: "Ailenizin personel ihtiyacını paylaşın, danışman ekibimiz uygun aday eşleştirmesi için sizinle iletişime geçsin.",
  alternates: {
    canonical: "https://dadikapida.com/aile-basvurusu"
  }
};

export default function FamilyApplicationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
