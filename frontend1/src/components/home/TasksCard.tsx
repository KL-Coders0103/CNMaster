import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTasksCardStyles } from "../../styles/components/home/tasksCardStyles";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { useNavigation } from "@react-navigation/native";

const TasksCard = () => {
  const dashboard = useDashboardStore(state => state.dashboard);
  const navigation = useNavigation<any>();
  const tasks = dashboard?.tasks ?? [];
  const hasTasks = tasks.length > 0;

  const { colors } = useThemeStore();
  const styles = getTasksCardStyles(colors);

  return (
    <View style={styles.tasksCard}>
      <View style={styles.tasksHeader}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>

        {hasTasks && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Planner")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {!hasTasks ? (
        <>
          <Text style={styles.emptyTaskText}>No tasks for today.</Text>
          <Text style={styles.emptyTaskSubText}>
            Stay organized by planning your study schedule.
          </Text>

          <TouchableOpacity style={styles.openPlannerButton} activeOpacity={0.7} onPress={() => navigation.navigate("Planner")}>
            <Text style={styles.openPlannerText}>Open Planner</Text>
          </TouchableOpacity>
        </>
      ) : (
        tasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate(
                "Planner",
                {
                  selectedTaskId: task.id,
                }
              )
            }
          >
            <Ionicons
              name={task.completed ? "checkbox" : "square-outline"}
              size={24}
              color={task.completed ? colors.primary : colors.textSecondary}
            />

            <Text
              style={[
                styles.taskText,
                task.completed && {
                  textDecorationLine: "line-through",
                  color: colors.textSecondary,
                },
              ]}
            >
              {task.title}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default TasksCard;