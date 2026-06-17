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
        rose:   "#E9185B",
        rose2:  "#BF1047",
        green:  "#E9185B",   /* alias - geriye dönük uyumluluk */
        green2: "#BF1047",
        navy:   "#071B3A",
        trust:  "#BF1047",
        gold:   "#D69A2D",
        ink:    "#071B3A",
        body:   "#1C2C45",
        muted:  "#5C6A80",
        line:   "#F0D8E2",
        bg:     "#FFF7FA",
        ivory:  "#FFF3F7"
      },
      boxShadow: {
        sm:   "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        md:   "0 2px 4px rgba(0,0,0,0.05), 0 12px 36px rgba(0,0,0,0.09)",
        lg:   "0 4px 8px rgba(0,0,0,0.06), 0 24px 64px rgba(0,0,0,0.12)",
        gold: "0 4px 16px rgba(184,134,11,0.28)",
        rose: "0 4px 16px rgba(233,24,91,0.28)"
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
