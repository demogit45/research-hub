import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: "var(--ink)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        text: "var(--text)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        danger: "var(--danger)",
        // Categories & Depts
        "c-start": "var(--c-start)",
        "c-research": "var(--c-research)",
        "c-notes": "var(--c-notes)",
        "c-code": "var(--c-code)",
        "c-chat": "var(--c-chat)",
        "c-admin": "var(--c-admin)",
        "d-research": "var(--d-research)",
        "d-tech": "var(--d-tech)",
        "d-multimedia": "var(--d-multimedia)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
      },
      boxShadow: {
        glow: "0 0 35px -8px rgba(var(--accent-rgb), 0.25)",
        up: "0 18px 45px -12px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
