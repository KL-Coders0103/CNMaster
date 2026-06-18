import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  PlannerTask,
} from "../../types/planner";

import {
  useThemeStore,
} from "../../store/themeStore";

import {
  createTaskCardStyles,
} from "../../styles/components/planner/taskcardStyles";

type TaskCardProps = {
  task: PlannerTask;

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

const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) => {

  const colors =
    useThemeStore(
      state => state.colors
    );

  const styles =
    createTaskCardStyles(
      colors
    );

  return (
    <View
      style={
        styles.container
      }
    >
      <TouchableOpacity
        onPress={() =>
          onToggle(
            task.id
          )
        }
      >
        <Ionicons
          name={
            task.isCompleted
              ? "checkbox"
              : "square-outline"
          }
          size={26}
          color={
            task.isCompleted
              ? colors.success
              : colors.primary
          }
        />
      </TouchableOpacity>

      <View
        style={
          styles.content
        }
      >
        <Text
          style={[
            styles.title,

            task.isCompleted && {
              textDecorationLine:
                "line-through",
              opacity: 0.6,
            },
          ]}
        >
          {task.title}
        </Text>

        {!!task.description && (
          <Text
            style={
              styles.description
            }
          >
            {task.description}
          </Text>
        )}

        <Text
          style={
            styles.dueDate
          }
        >
          Due:
          {" "}
          {new Date(
            task.dueDate
          ).toLocaleDateString()}
        </Text>
      </View>

      <View
        style={
          styles.actions
        }
      >
        <TouchableOpacity
          onPress={() =>
            onEdit(task)
          }
        >
          <Ionicons
            name="create-outline"
            size={22}
            color={
              colors.primary
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 16,
          }}
          onPress={() =>
            onDelete(
              task.id
            )
          }
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={
              colors.error
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskCard;