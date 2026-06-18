import React from "react";

import {
  View,
  Text,
} from "react-native";

import {
  useThemeStore,
} from "../../store/themeStore";

import {
  createPlannerStatsStyles,
} from "../../styles/components/planner/plannerStatsStyles";

type PlannerStatsProps = {
  totalTasks: number;

  completedTasks: number;
};

const PlannerStats = ({
  totalTasks,
  completedTasks,
}: PlannerStatsProps) => {

  const colors =
    useThemeStore(
      state => state.colors
    );

  const styles =
    createPlannerStatsStyles(
      colors
    );

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (
            completedTasks /
            totalTasks
          ) * 100
        );

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.header
        }
      >
        <Text
          style={
            styles.title
          }
        >
          Today's Progress
        </Text>

        <Text
          style={
            styles.percentage
          }
        >
          {progress}%
        </Text>
      </View>

      <View
        style={
          styles.progressBar
        }
      >
        <View
          style={[
            styles.progressFill,
            {
              width:
                `${progress}%`,
            },
          ]}
        />
      </View>

      <View
        style={
          styles.statsRow
        }
      >
        <View>
          <Text
            style={
              styles.statValue
            }
          >
            {totalTasks}
          </Text>

          <Text
            style={
              styles.statLabel
            }
          >
            Total
          </Text>
        </View>

        <View>
          <Text
            style={
              styles.statValue
            }
          >
            {completedTasks}
          </Text>

          <Text
            style={
              styles.statLabel
            }
          >
            Completed
          </Text>
        </View>

        <View>
          <Text
            style={
              styles.statValue
            }
          >
            {
              totalTasks -
              completedTasks
            }
          </Text>

          <Text
            style={
              styles.statLabel
            }
          >
            Pending
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PlannerStats;