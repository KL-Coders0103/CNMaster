import React from "react";
import { View, Text } from "react-native";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { getWeeklyHeatMapStyles } from "../../styles/components/home/weaklyheatMapStyles";

const WeeklyHeatmapCard = () => {
  const dashboard = useDashboardStore((state) => state.dashboard);
  const weeklyActivity = dashboard?.weeklyActivity ?? [];

  const { colors } = useThemeStore();
  const styles = getWeeklyHeatMapStyles(colors);

  if (weeklyActivity.length === 0) return null;

  const getHeatmapColor = (xp: number) => {
    if (xp === 0) return colors.isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; 
    
    let hex = colors.primary.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(x => x + x).join("");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if (xp <= 20) return `rgba(${r}, ${g}, ${b}, 0.4)`; 
    if (xp <= 50) return `rgba(${r}, ${g}, ${b}, 0.7)`; 
    return `rgba(${r}, ${g}, ${b}, 1.0)`;               
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Weekly Consistency</Text>
      
      <View style={styles.heatmapContainer}>
        {weeklyActivity.map((record, index) => (
          <View key={index} style={styles.dayColumn}>
            <View 
              style={[
                styles.heatmapSquare, 
                { backgroundColor: getHeatmapColor(record.xp) }
              ]} 
            />
            <Text style={styles.dayLabel}>{record.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeeklyHeatmapCard;