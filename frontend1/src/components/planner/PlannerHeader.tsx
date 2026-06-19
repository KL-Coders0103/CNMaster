import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type PlannerHeaderProps = {
  onAddTask: () => void;
};

const PlannerHeader = ({ onAddTask }: PlannerHeaderProps) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Planner</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={onAddTask}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={18} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default PlannerHeader;