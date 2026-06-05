import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading"
});

export const metadata = {
  title: "Dadı Kapıda CRM",
  description: "Internal operations CRM"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${bodyFont.variable} ${headingFont.variable} font-sans antialiased min-h-screen`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
