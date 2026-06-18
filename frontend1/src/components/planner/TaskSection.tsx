import React from "react";

import {
  View,
  Text,
} from "react-native";

import {
  PlannerTask,
} from "../../types/planner";

import TaskCard from "./TaskCard";

import {
  useThemeStore,
} from "../../store/themeStore";

import {
  createTaskSectionStyles,
} from "../../styles/components/planner/taskSectionStyles";

type TaskSectionProps = {
  title: string;

  tasks: PlannerTask[];

  onToggle: (
    taskId: string
  ) => void;

  onEdit: (
    task: PlannerTask
  ) => void;

  onDelete: (
    taskId: string
  ) => void;
};

const TaskSection = ({
  title,
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: TaskSectionProps) => {

  const colors =
    useThemeStore(
      state => state.colors
    );

  const styles =
    createTaskSectionStyles(
      colors
    );

  if (
    tasks.length === 0
  ) {
    return null;
  }

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.title
        }
      >
        {title}
      </Text>

      {tasks.map(
        task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={
              onToggle
            }
            onEdit={
              onEdit
            }
            onDelete={
              onDelete
            }
          />
        )
      )}
    </View>
  );
};

export default TaskSection;