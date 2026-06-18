import React from "react";
import { View, Text, ScrollView } from "react-native";

import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { getWeeklyHeatMapStyles } from "../../styles/components/home/weaklyheatMapStyles";

const DAYS = 91;

const WeeklyHeatmapCard = () => {

  const dashboard =
    useDashboardStore(
      state => state.dashboard
    );

  const activityHeatmap =
    dashboard?.activityHeatmap ?? [];

  const { colors } =
    useThemeStore();

  const styles =
    getWeeklyHeatMapStyles(
      colors
    );

  const activityMap =
    new Map(
      activityHeatmap.map(
        item => [
          item.date,
          item.xp,
        ]
      )
    );

  const cells = [];

  let totalXp = 0;

  for (
    let i = DAYS - 1;
    i >= 0;
    i--
  ) {

    const date =
      new Date();

    date.setDate(
      date.getDate() - i
    );

    const dateString =
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

    const xp =
      activityMap.get(
        dateString
      ) ?? 0;

    totalXp += xp;

    cells.push({
      date: dateString,
      xp,
    });
  }

  const weeks = [];

  for (
    let i = 0;
    i < cells.length;
    i += 7
  ) {
    weeks.push(
      cells.slice(
        i,
        i + 7
      )
    );
  }

  const getColor =
    (xp: number) => {

      if (xp === 0) {
        return colors.isDarkMode
          ? "#161B22"
          : "#EBEDF0";
      }

      if (xp <= 20) {
        return "#9BE9A8";
      }

      if (xp <= 50) {
        return "#40C463";
      }

      if (xp <= 100) {
        return "#30A14E";
      }

      return "#216E39";
    };

  return (
    <View
      style={styles.card}
    >
      <Text
        style={styles.sectionTitle}
      >
        Learning Consistency
      </Text>

      <View
        style={styles.heatmapWrapper}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={styles.heatmapGrid}
          >
            {weeks.map(
              (
                week,
                weekIndex
              ) => (
                <View
                  key={weekIndex}
                  style={styles.weekColumn}
                >
                  {week.map(
                    (
                      day,
                      dayIndex
                    ) => (
                      <View
                        key={`${weekIndex}-${dayIndex}`}
                        style={[
                          styles.heatmapSquare,
                          {
                            backgroundColor:
                              getColor(
                                day.xp
                              ),
                          },
                        ]}
                      />
                    )
                  )}
                </View>
              )
            )}
          </View>
        </ScrollView>

        <View
          style={
            styles.legendContainer
          }
        >
          <Text
            style={
              styles.summaryText
            }
          >
            {Math.round(
              totalXp
            )} XP earned in last 90 days
          </Text>

          <View
            style={
              styles.legendLeft
            }
          >
            <Text
              style={
                styles.legendText
              }
            >
              Less
            </Text>

            <View
              style={
                styles.legendSquares
              }
            >
              {[0,1,2,3,4].map(
                level => (
                  <View
                    key={level}
                    style={[
                      styles.heatmapSquare,
                      {
                        backgroundColor:
                          getColor(
                            level === 0
                              ? 0
                              : level === 1
                              ? 10
                              : level === 2
                              ? 30
                              : level === 3
                              ? 70
                              : 150
                          ),
                      },
                    ]}
                  />
                )
              )}
            </View>

            <Text
              style={
                styles.legendText
              }
            >
              More
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WeeklyHeatmapCard;