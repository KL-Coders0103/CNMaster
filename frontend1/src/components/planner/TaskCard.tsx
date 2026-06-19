import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { PlannerTask } from "../../types/planner";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type TaskCardProps = {
  task: PlannerTask;
  onToggle: (taskId: string) => void;
  onEdit: (task: PlannerTask) => void;
  onDelete: (taskId: string) => void;
};

const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, task.isCompleted && styles.completedContainer]}>
      <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.checkbox}>
        <Feather 
          name={task.isCompleted ? "check-square" : "square"} 
          size={24} 
          color={task.isCompleted ? colors.success : colors.primary} 
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.isCompleted && styles.completedTitle]}>
          {task.title}
        </Text>
        {!!task.description && (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        )}
        <Text style={styles.dueDate}>
          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(task)} style={styles.actionButton}>
          <Feather name="edit-2" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.actionButton}>
          <Feather name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedContainer: {
    backgroundColor: colors.background,
    opacity: 0.8,
  },
  checkbox: {
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
  },
  actions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default TaskCard;