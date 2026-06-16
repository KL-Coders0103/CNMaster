import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { createThemedStyles } from "../../styles/components/themeToggleStyles";

const ThemeToggle = () => {

  const { isDarkMode, colors, toggleTheme } = useThemeStore();
  const styles = createThemedStyles(colors);

  return (
    <TouchableOpacity 
      style={styles.toggleContainer} 
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconWrapper}>
          <Feather 
            name={isDarkMode ? "moon" : "sun"} 
            size={18} 
            color={isDarkMode ? colors.primaryDark : colors.warning} 
          />
        </View>
        <Text style={styles.toggleText}>
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>
      </View>

      <View style={[styles.switchTrack, isDarkMode ? styles.trackActive : styles.trackInactive]}>
        <View style={[styles.switchThumb, isDarkMode ? styles.thumbActive : styles.thumbInactive]} />
      </View>
    </TouchableOpacity>
  );
};

export default ThemeToggle;