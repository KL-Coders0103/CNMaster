import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { formatLocalDate } from "../../utils/dateUtils";

type CalendarStripProps = {
  selectedDate: Date;
  calendarDates: string[];
  onSelectDate: (date: Date) => void;
};

const CalendarStrip = ({ selectedDate, calendarDates, onSelectDate }: CalendarStripProps) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date;
  });

  return (
    <View style={styles.container}>
      {weekDays.map((date) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const dateString = formatLocalDate(date);
        const hasTasks = calendarDates.includes(dateString);

        return (
          <TouchableOpacity
            key={date.toISOString()}
            style={[styles.dayContainer, isSelected && styles.selectedDay]}
            activeOpacity={0.7}
            onPress={() => onSelectDate(date)}
          >
            <Text style={[styles.dayLabel, isSelected && styles.selectedText]}>
              {date.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 3)}
            </Text>
            
            <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
              {date.getDate()}
            </Text>

            {hasTasks && (
              <View style={[styles.dot, isSelected && styles.selectedDot]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 8,
  },
  dayContainer: {
    width: 44,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  selectedText: {
    color: "#FFFFFF",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  selectedDot: {
    backgroundColor: "#FFFFFF",
  },
});

export default CalendarStrip;