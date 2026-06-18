import React from "react";
import { View, Text } from "react-native";

import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { getMotivationCardStyles } from "../../styles/components/home/motivationCardStyles";

const MotivationCard = () => {

  const dashboard =
    useDashboardStore(
      state => state.dashboard
    );

  const motivation =
    dashboard?.motivation;

  const { colors } =
    useThemeStore();

  const styles =
    getMotivationCardStyles(
      colors
    );

  if (!motivation) {
    return null;
  }

  return (
    <View style={styles.motivationCard}>
      <Text style={styles.sectionTitle}>
        Daily Motivation
      </Text>

      <Text style={styles.quoteText}>
        "{motivation.text}"
      </Text>

      <Text style={styles.quoteAuthor}>
        — {motivation.author}
      </Text>
    </View>
  );
};

export default MotivationCard;