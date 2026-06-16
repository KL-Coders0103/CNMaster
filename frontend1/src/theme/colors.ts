export const lightPalette = {
  isDarkMode: false, 

  primary: "#4F46E5",
  primaryDark: "#3730A3",
  secondary: "#6366F1",
  
  background: "#F8FAFC",
  surface: "#FFFFFF",
  
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  
  border: "#E2E8F0",
  
  error: "#DC2626",
  success: "#16A34A",
  warning: "#F59E0B",
  
  placeholder: "#94A3B8",
  white: "#FFFFFF", 
  shadow: "rgba(15,23,42,0.08)",
};

export const darkPalette = {
  isDarkMode: true, 

  primary: "#6366F1", 
  primaryDark: "#818CF8",
  secondary: "#4F46E5",
  
  background: "#0F172A", 
  surface: "#1E293B",    
  
  textPrimary: "#F8FAFC", 
  textSecondary: "#94A3B8",
  
  border: "#334155",
  
  error: "#EF4444",
  success: "#22C55E",
  warning: "#FBBF24",
  
  placeholder: "#475569",
  white: "#FFFFFF", 
  shadow: "rgba(0,0,0,0.5)", 
};

export type ThemePalette = typeof lightPalette;