import type { Config } from "tailwindcss";

/*
 * TAILWIND CONFIG — DESIGN TOKENS
 * ================================
 * This file is the single source of truth for our brand colors, fonts,
 * and spacing. Instead of writing hex codes in every component, we define
 * them once here and use them as Tailwind class names like `bg-brand-gold`
 * or `text-brand-dark` throughout the entire project.
 *
 * HOW TAILWIND WORKS (quick primer):
 * Tailwind is a "utility-first" CSS framework. Instead of writing a CSS file
 * with classes like .hero { background: black; padding: 4rem; }, you put
 * small single-purpose classes directly on your HTML/JSX elements:
 *   <div className="bg-black p-16">
 * Each class does exactly ONE thing. You compose them together to build UI.
 *
 * The `theme.extend` section below ADDS our custom values ON TOP of
 * Tailwind's built-in ones (like the default blue-500, red-300, etc.)
 * so we don't lose any defaults.
 */

const config: Config = {
  // `content` tells Tailwind which files to scan for class names.
  // It only includes CSS for classes it actually finds — this keeps
  // the final CSS bundle tiny (often <10kb).
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // BRAND COLORS
      // These become Tailwind classes like: bg-brand-gold, text-brand-dark,
      // border-brand-muted, etc.
      colors: {
        brand: {
          black: "#0E0E0E",   // Deepest background
          dark: "#1A1A1A",    // Card / section backgrounds
          dark2: "#252525",   // Slightly lighter card backgrounds
          mid: "#3A3A3A",     // Borders, dividers
          muted: "#9A9080",   // Placeholder text, secondary labels
          light: "#E8E2D9",   // Body text on dark backgrounds
          white: "#FAF9F7",   // Off-white — softer than pure white
          gold: "#C9A84C",    // PRIMARY BRAND ACCENT — CTAs, highlights
          "gold-light": "#F0D080", // Hover state for gold buttons
          "gold-dark": "#B89040",  // Active/pressed state for gold buttons
        },
      },

      // FONTS
      // We import these from Google Fonts in our layout.tsx.
      // Usage: font-display (Playfair Display) or font-body (DM Sans)
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },

      // ANIMATIONS
      // Custom keyframe animations used across the site.
      // Usage: animate-marquee, animate-fadeIn, animate-slideUp
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        fadeIn: "fadeIn 0.4s ease-out",
        slideUp: "slideUp 0.5s ease-out",
        slideInRight: "slideInRight 0.3s ease-out",
      },
    },
  },

  plugins: [],
};

export default config;
