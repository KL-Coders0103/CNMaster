import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const EmptyPlanner = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Feather name="calendar" size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>No Tasks Scheduled</Text>
      <Text style={styles.description}>
        Your planner is a clean slate. Tap the plus icon to add your first learning goal.
      </Text>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 80,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default EmptyPlanner;