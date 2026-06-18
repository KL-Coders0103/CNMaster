import React from "react";

import {
  View,
  Text,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useThemeStore,
} from "../../store/themeStore";

import {
  createEmptyPlannerStyles,
} from "../../styles/components/planner/emptyPlannerStyles";

const EmptyPlanner =
  () => {

    const colors =
      useThemeStore(
        state => state.colors
      );

    const styles =
      createEmptyPlannerStyles(
        colors
      );

    return (
      <View
        style={
          styles.container
        }
      >
        <Ionicons
          name="calendar-outline"
          size={64}
          color={
            colors.placeholder
          }
        />

        <Text
          style={
            styles.title
          }
        >
          No Tasks Yet
        </Text>

        <Text
          style={
            styles.description
          }
        >
          Start planning your learning journey by creating your first task.
        </Text>
      </View>
    );
  };

export default EmptyPlanner;