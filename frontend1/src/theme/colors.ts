export const lightPalette = {
  isDarkMode: false,

  // Brand Colors
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  primaryLight: "rgba(79, 70, 229, 0.1)", // Ideal for soft icon backgrounds
  secondary: "#6366F1",

  // Backgrounds & Surfaces
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceHighlight: "#F1F5F9", // Ideal for pressed states or secondary cards

  // Typography
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#CBD5E1", // Resolves the missing property in Empty States

  // Borders & Dividers
  border: "#E2E8F0",

  // Semantic Status
  error: "#DC2626",
  success: "#16A34A",
  warning: "#F59E0B",

  // Utilities
  placeholder: "#94A3B8",
  white: "#FFFFFF",
  shadow: "rgba(15,23,42,0.08)",
  overlay: "rgba(15,23,42,0.4)", // Standardized modal backdrop
};

export const darkPalette = {
  isDarkMode: true,

  // Brand Colors
  primary: "#6366F1",
  primaryDark: "#818CF8",
  primaryLight: "rgba(99, 102, 241, 0.15)",
  secondary: "#4F46E5",

  // Backgrounds & Surfaces
  background: "#0F172A",
  surface: "#1E293B",
  surfaceHighlight: "#334155",

  // Typography
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#475569",

  // Borders & Dividers
  border: "#334155",

  // Semantic Status
  error: "#EF4444",
  success: "#22C55E",
  warning: "#FBBF24",

  // Utilities
  placeholder: "#475569",
  white: "#FFFFFF",
  shadow: "rgba(0,0,0,0.5)",
  overlay: "rgba(0,0,0,0.7)",
};

export type ThemePalette = typeof lightPalette;