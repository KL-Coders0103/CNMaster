import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from './theme';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = storage.getBoolean('isDarkMode');
    if (savedTheme !== undefined) {
      setIsDark(savedTheme);
    } else {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      storage.set('isDarkMode', newTheme);
      return newTheme;
    });
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};