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
  useThemeStore,
} from "../../store/themeStore";

import {
  createPlannerHeaderStyles,
} from "../../styles/components/planner/plannerHeaderStyles";

type PlannerHeaderProps = {
  onAddTask: () => void;
};

const PlannerHeader = ({
  onAddTask,
}: PlannerHeaderProps) => {

  const colors =
    useThemeStore(
      state => state.colors
    );

  const styles =
    createPlannerHeaderStyles(
      colors
    );

  const currentDate =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
    );

  return (
    <View
      style={
        styles.container
      }
    >
      <View>
        <Text
          style={
            styles.title
          }
        >
          Planner
        </Text>

        <Text
          style={
            styles.date
          }
        >
          {currentDate}
        </Text>
      </View>

      <TouchableOpacity
        style={
          styles.addButton
        }
        onPress={onAddTask}
      >
        <Ionicons
          name="add"
          size={20}
          color={
            colors.white
          }
        />

        <Text
          style={
            styles.addButtonText
          }
        >
          Add Task
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlannerHeader;