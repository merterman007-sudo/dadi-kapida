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
        rose:   "#8C5368",
        rose2:  "#6D3D51",
        green:  "#8C5368",   /* alias - geriye dönük uyumluluk */
        green2: "#6D3D51",
        navy:   "#8C5368",
        trust:  "#8C5368",
        gold:   "#B8860B",
        ink:    "#1C1015",
        body:   "#4A3840",
        muted:  "#7C606B",
        line:   "#EAD0D9",
        bg:     "#FAF5F7",
        ivory:  "#FBF5F7"
      },
      boxShadow: {
        sm:   "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        md:   "0 2px 4px rgba(0,0,0,0.05), 0 12px 36px rgba(0,0,0,0.09)",
        lg:   "0 4px 8px rgba(0,0,0,0.06), 0 24px 64px rgba(0,0,0,0.12)",
        gold: "0 4px 16px rgba(184,134,11,0.28)",
        rose: "0 4px 16px rgba(140,83,104,0.28)"
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
