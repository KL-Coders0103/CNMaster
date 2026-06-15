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
  tasksCardStyles,
} from "../../styles/components/home/tasksCardStyles";
import { useDashboardStore } from "../../store/dashboardStore";


const TasksCard = () => {

  const dashboard =
    useDashboardStore(
      state => state.dashboard
    );

  const tasks =
    dashboard?.tasks ?? [];

  const hasTasks =
    tasks.length > 0;

  return (
    <View
      style={
        tasksCardStyles.tasksCard
      }
    >
      <View
        style={
          tasksCardStyles.tasksHeader
        }
      >
        <Text
          style={
            tasksCardStyles.sectionTitle
          }
        >
          Today's Tasks
        </Text>

        {hasTasks && (
          <TouchableOpacity>
            <Text
              style={
                tasksCardStyles.seeAllText
              }
            >
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!hasTasks ? (
        <>
          <Text
            style={
              tasksCardStyles.emptyTaskText
            }
          >
            No tasks for today.
          </Text>

          <Text
            style={
              tasksCardStyles.emptyTaskSubText
            }
          >
            Stay organized by
            planning your study
            schedule.
          </Text>

          <TouchableOpacity
            style={
              tasksCardStyles.openPlannerButton
            }
          >
            <Text
              style={
                tasksCardStyles.openPlannerText
              }
            >
              Open Planner
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        tasks.map(task => (
          <View
            key={task.id}
            style={
              tasksCardStyles.taskItem
            }
          >
            <Ionicons
              name={
                task.completed
                  ? "checkbox"
                  : "square-outline"
              }
              size={24}
              color={
                task.completed
                  ? "#2563EB"
                  : "#9CA3AF"
              }
            />

            <Text
              style={[
                tasksCardStyles.taskText,
                task.completed && {
                  textDecorationLine:
                    "line-through",
                  color:
                    "#9CA3AF",
                },
              ]}
            >
              {task.title}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

export default TasksCard;