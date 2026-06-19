import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { useNavigation } from "@react-navigation/native";
import { ThemePalette } from "../../theme/colors";

const TasksCard = () => {
  const dashboard = useDashboardStore(state => state.dashboard);
  const navigation = useNavigation<any>();
  const tasks = dashboard?.tasks ?? [];
  const hasTasks = tasks.length > 0;

  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        {hasTasks && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Planner")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {!hasTasks ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <Feather name="check-circle" size={24} color={colors.textSecondary} />
          </View>
          <Text style={styles.emptyText}>You're all caught up!</Text>
          <Text style={styles.emptySubText}>Add tasks to your planner to keep your streak going.</Text>
          <TouchableOpacity style={styles.emptyButton} activeOpacity={0.7} onPress={() => navigation.navigate("Planner")}>
            <Text style={styles.emptyButtonText}>Open Planner</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.taskList}>
          {tasks.map((task, index) => (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskItem, index === tasks.length - 1 && styles.lastTaskItem]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Planner", { selectedTaskId: task.id })}
            >
              <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
                {task.completed && <Feather name="check" size={14} color={colors.white} />}
              </View>

              <Text
                style={[
                  styles.taskText,
                  task.completed && styles.taskTextCompleted,
                ]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2,
  },
  taskList: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  lastTaskItem: {
    borderBottomWidth: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});

export default TasksCard;