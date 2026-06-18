import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  useThemeStore,
} from "../../store/themeStore";

import {
  createCalendarStripStyles,
} from "../../styles/components/planner/calendarStripStyles";
import { formatLocalDate } from "../../utils/dateUtils";

type CalendarStripProps = {
  selectedDate: Date;
  calendarDates: string[];
  onSelectDate: (
    date: Date
  ) => void;
};

const CalendarStrip = ({
  selectedDate,
  calendarDates,
  onSelectDate,
}: CalendarStripProps) => {

  const colors =
    useThemeStore(
      state => state.colors
    );

  const styles =
    createCalendarStripStyles(
      colors
    );

  const today =
    new Date();

  const startOfWeek =
    new Date(today);

  startOfWeek.setDate(
    today.getDate() -
      today.getDay() +
      1
  );

  const weekDays =
    Array.from(
      { length: 7 },
      (_, index) => {
        const date =
          new Date(
            startOfWeek
          );

        date.setDate(
          startOfWeek.getDate() +
            index
        );

        return date;
      }
    );

  return (
    <View
      style={
        styles.container
      }
    >
      {weekDays.map(
        date => {

          const isSelected =
            date.toDateString() ===
            selectedDate.toDateString();
          
          const dateString = formatLocalDate(date);

          const hasTasks = calendarDates.includes(dateString);

          return (
            <TouchableOpacity
              key={
                date.toISOString()
              }
              style={[
                styles.dayContainer,

                isSelected &&
                  styles.selectedDay,
              ]}
              onPress={() =>
                onSelectDate(
                  date
                )
              }
            >
              <Text
                style={[
                  styles.dayLabel,

                  isSelected && {
                    color:
                      colors.white,
                  },
                ]}
              >
                {date
                  .toLocaleDateString(
                    "en-US",
                    {
                      weekday:
                        "short",
                    }
                  )
                  .substring(
                    0,
                    3
                  )}
              </Text>

              <Text
                style={[
                  styles.dayNumber,

                  isSelected && {
                    color:
                      colors.white,
                  },
                ]}
              >
                {date.getDate()}
              </Text>

              {
                hasTasks && (
                  <View
                    style={[
                      styles.dot,
                      isSelected && {
                        backgroundColor: colors.white,
                      },
                    ]}
                  ></View>
                )
              }
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
};

export default CalendarStrip;