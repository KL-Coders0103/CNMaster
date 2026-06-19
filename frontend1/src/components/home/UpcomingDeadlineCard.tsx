import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const UpcomingDeadlineCard = () => {
  const dashboard = useDashboardStore((state) => state.dashboard);
  const assessment = dashboard?.upcomingAssessment;
  const navigation = useNavigation<any>(); 

  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!assessment?.dueDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(assessment.dueDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [assessment?.dueDate]);

  if (!assessment) return null;

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;
  const bgColor = isUrgent ? "#EF4444" : colors.primary; 

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: bgColor }]}
      activeOpacity={0.85}
      onPress={() => console.log(`Navigating to ${assessment.type}: ${assessment.title}`)}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{assessment.type}</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#FFFFFF" opacity={0.8} />
        </View>

        <Text style={styles.title} numberOfLines={2}>{assessment.title}</Text>
        
        <View style={styles.timerRow}>
          <Feather name="clock" size={14} color="#FFFFFF" style={{ marginRight: 6, opacity: 0.9 }} />
          <Text style={styles.timerText}>
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {timeLeft.hours}h {timeLeft.minutes}m remaining
          </Text>
        </View>
      </View>
      
      <Feather 
        name="calendar" 
        size={110} 
        color="#FFFFFF" 
        style={styles.bgIcon} 
      />
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  content: {
    padding: 24,
    zIndex: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    lineHeight: 28,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  bgIcon: {
    position: "absolute",
    right: -20,
    bottom: -20,
    opacity: 0.15,
    zIndex: 1,
    transform: [{ rotate: "-15deg" }],
  },
});

export default UpcomingDeadlineCard;