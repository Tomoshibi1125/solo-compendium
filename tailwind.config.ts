import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        heading: ['Rajdhani', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        system: ['Share Tech Mono', 'monospace'],
        arise: ['Orbitron', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Solo Leveling: ARISE - Supreme Deity Colors
        shadow: {
          blue: "hsl(var(--shadow-blue))",
          purple: "hsl(var(--shadow-purple))",
          deep: "hsl(var(--shadow-deep))",
          dark: "hsl(var(--shadow-dark))",
        },
        monarch: {
          gold: "hsl(var(--monarch-gold))",
          silver: "hsl(var(--monarch-silver))",
        },
        gate: {
          red: "hsl(var(--gate-red))",
          e: "hsl(var(--gate-e))",
          d: "hsl(var(--gate-d))",
          c: "hsl(var(--gate-c))",
          b: "hsl(var(--gate-b))",
          a: "hsl(var(--gate-a))",
          s: "hsl(var(--gate-s))",
          ss: "hsl(var(--gate-ss))",
          national: "hsl(var(--gate-national))",
        },
        hunter: {
          blue: "hsl(var(--hunter-blue))",
        },
        mana: {
          cyan: "hsl(var(--mana-cyan))",
        },
        arise: {
          violet: "hsl(var(--arise-violet))",
        },
        system: {
          green: "hsl(var(--system-green))",
          glow: "hsl(var(--system-glow))",
        },
        // Named Shadow Soldiers
        soldier: {
          igris: "hsl(var(--igris-crimson))",
          beru: "hsl(var(--beru-gold))",
          bellion: "hsl(var(--bellion-silver))",
        },
        void: {
          black: "hsl(var(--void-black))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "arise": {
          "0%": { transform: "translateY(80px) scale(0.7)", opacity: "0", filter: "blur(15px)" },
          "60%": { transform: "translateY(-10px) scale(1.05)", filter: "blur(2px)" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1", filter: "blur(0)" },
        },
        "shadow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--shadow-blue) / 0.3), 0 0 40px hsl(var(--shadow-purple) / 0.2)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--shadow-blue) / 0.5), 0 0 60px hsl(var(--shadow-purple) / 0.3)" },
        },
        "monarch-seal": {
          "0%, 100%": { opacity: "0.5", backgroundPosition: "0% 50%" },
          "50%": { opacity: "0.9", backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "arise": "arise 1s ease-out forwards",
        "shadow-pulse": "shadow-pulse 3s ease-in-out infinite",
        "monarch-seal": "monarch-seal 4s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-system": "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--shadow-purple)) 50%, hsl(var(--arise-violet)) 100%)",
        "gradient-shadow": "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--shadow-purple)) 50%, hsl(var(--void-black)) 100%)",
        "gradient-arise": "linear-gradient(180deg, hsl(var(--arise-violet)) 0%, hsl(var(--shadow-purple)) 50%, hsl(var(--shadow-blue)) 100%)",
        "gradient-monarch": "linear-gradient(135deg, hsl(var(--monarch-gold)) 0%, hsl(var(--shadow-purple)) 50%, hsl(var(--shadow-blue)) 100%)",
      },
      boxShadow: {
        "monarch": "0 0 20px hsl(var(--shadow-blue) / 0.3), 0 0 40px hsl(var(--shadow-purple) / 0.2)",
        "arise": "0 0 30px hsl(var(--arise-violet) / 0.4), 0 0 60px hsl(var(--shadow-purple) / 0.3)",
        "system": "0 0 20px hsl(var(--system-green) / 0.3), inset 0 0 10px hsl(var(--system-green) / 0.1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
