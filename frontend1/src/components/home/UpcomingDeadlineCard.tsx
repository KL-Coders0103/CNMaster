import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { getUpcomingDeadlineCardStyles } from "../../styles/components/home/upcomingDeadlineCardStyles";

const UpcomingDeadlineCard = () => {
  const dashboard = useDashboardStore((state) => state.dashboard);
  const assessment = dashboard?.upcomingAssessment;
  const navigation = useNavigation<any>(); 

  const { colors } = useThemeStore();
  const styles = getUpcomingDeadlineCardStyles(colors);

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
  const bgColor = isUrgent ? colors.error : colors.primaryDark; 

  const handlePress = () => {
    console.log(`User tapped on ${assessment.type}: ${assessment.title}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: bgColor }]}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{assessment.type}</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.white} opacity={0.8} />
        </View>

        <Text style={styles.title}>{assessment.title}</Text>
        
        <View style={styles.timerRow}>
          <Feather name="clock" size={14} color={colors.white} style={{ marginRight: 6, opacity: 0.9 }} />
          <Text style={styles.timerText}>
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {timeLeft.hours}h {timeLeft.minutes}m remaining
          </Text>
        </View>
      </View>
      
      <Feather 
        name="alert-circle" 
        size={100} 
        color={colors.white} 
        style={styles.bgIcon} 
      />
    </TouchableOpacity>
  );
};

export default UpcomingDeadlineCard;