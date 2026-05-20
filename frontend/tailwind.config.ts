import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E8252A",
          dark: "#B91C1C",
          light: "#FCA5A5",
        },
        surface: {
          DEFAULT: "#0F1117",
          card: "#161B27",
          elevated: "#1E2535",
          border: "#2A3347",
        },
        text: {
          primary: "#F0F4FF",
          secondary: "#8B9FC0",
          muted: "#4A5568",
        },
        status: {
          on_track: "#10B981",
          at_risk: "#F59E0B",
          critical: "#EF4444",
          completed: "#6366F1",
          pending: "#6B7280",
          in_progress: "#3B82F6",
          blocked: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
