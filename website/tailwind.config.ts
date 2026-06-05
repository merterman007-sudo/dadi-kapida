import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Cormorant Garamond", "Georgia", "serif"]
      },
      colors: {
        green:  "#1C4A34",
        green2: "#133526",
        navy:   "#1C4A34",
        trust:  "#1C4A34",
        gold:   "#B8860B",
        ink:    "#0A0F0D",
        body:   "#3D4D45",
        muted:  "#697B72",
        line:   "#DDE6E1",
        bg:     "#F7FAF8",
        ivory:  "#FDFAF5"
      },
      boxShadow: {
        sm:  "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        md:  "0 2px 4px rgba(0,0,0,0.05), 0 12px 36px rgba(0,0,0,0.09)",
        lg:  "0 4px 8px rgba(0,0,0,0.06), 0 24px 64px rgba(0,0,0,0.12)",
        gold:"0 4px 16px rgba(184,134,11,0.28)"
      },
      borderRadius: {
        card: "16px",
        xl2:  "20px",
        xl3:  "24px"
      }
    }
  },
  plugins: []
};

export default config;
