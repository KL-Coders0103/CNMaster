export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    primary: '#0F172A', 
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
  },
};

export const darkTheme = {
  colors: {
    background: '#09090B',
    surface: '#18181B',
    primary: '#FAFAFA',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#27272A',
    error: '#F87171',
  },
};

export type Theme = typeof lightTheme;