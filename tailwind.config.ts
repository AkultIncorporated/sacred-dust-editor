import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "sd-bg": "var(--bg)",
        "sd-panel": "var(--panel)",
        "sd-panel-2": "var(--panel-2)",
        "sd-line": "var(--line)",
        "sd-text": "var(--text)",
        "sd-muted": "var(--muted)",
        "sd-accent": "var(--accent)",
        "sd-accent-dark": "var(--accent-dark)",
        "sd-danger": "var(--danger)",
      },
    },
  },
};

export default config;
