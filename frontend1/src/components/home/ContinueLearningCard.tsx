import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getContinueLearningCardStyles } from "../../styles/components/home/continueLearningCardStyles";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";

const ContinueLearningCard = () => {
  const dashboard = useDashboardStore(state => state.dashboard);
  const continueLearning = dashboard?.continueLearning;
  const hasProgress = !!continueLearning;
  
  const { colors } = useThemeStore();
  const styles = getContinueLearningCardStyles(colors);

  if (!hasProgress) {
    return (
      <View style={styles.continueCard}>
        <Text style={styles.sectionTitle}>Start Learning</Text>
        <Text style={styles.progressLabel}>You haven't started yet.</Text>
        <TouchableOpacity style={styles.resumeButton} activeOpacity={0.7}>
          <Text style={styles.resumeText}>Start First Topic</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.continueCard}>
      <Text style={styles.sectionTitle}>Continue Learning</Text>
      <Text style={styles.topicTitle}>{continueLearning?.moduleName}</Text>
      <Text style={styles.progressLabel}>{continueLearning?.progress}% Completed</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${continueLearning?.progress}%` }]} />
      </View>

      <TouchableOpacity style={styles.resumeButton} activeOpacity={0.7}>
        <Text style={styles.resumeText}>Resume Learning</Text>
        {/* 👈 Dynamic color for the arrow */}
        <Ionicons name="arrow-forward" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default ContinueLearningCard;