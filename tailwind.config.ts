import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        gold: {
          50: "#FDFBF7",
          100: "#F7F3EA",
          200: "#EADECA",
          300: "#D7C4A5",
          400: "#C5A880",
          500: "#B39266",
          600: "#9E7E52",
          700: "#7F643E",
          800: "#5F4B2E",
          900: "#3D301D",
        },
        brass: {
          50: "#FDFBF7",
          100: "#F7F3EA",
          200: "#EADECA",
          300: "#D7C4A5",
          400: "#C5A880",
          500: "#B39266",
          600: "#9E7E52",
          700: "#7F643E",
          800: "#5F4B2E",
          900: "#3D301D",
        },
        obsidian: {
          700: "#232C42",
          750: "#1B2233",
          800: "#151B28",
          850: "#10141E",
          900: "#0B0E14",
          950: "#07090E",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
