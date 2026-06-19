import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PlannerTask } from "../../types/planner";
import TaskCard from "./TaskCard";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type TaskSectionProps = {
  title: string;
  tasks: PlannerTask[];
  onToggle: (taskId: string) => void;
  onEdit: (task: PlannerTask) => void;
  onDelete: (taskId: string) => void;
};

const TaskSection = ({ title, tasks, onToggle, onEdit, onDelete }: TaskSectionProps) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  if (tasks.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.list}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 16,
    paddingLeft: 4,
  },
  list: {
    gap: 4, // Ensures subtle separation between the TaskCards
  },
});

export default TaskSection;