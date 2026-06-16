import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getWeakAreasCardStyles } from "../../styles/components/home/weakAreasCardStyles";
import { useDashboardStore } from "../../store/dashboardStore"; 
import { useThemeStore } from "../../store/themeStore";

const WeakAreasCard = () => {
  const dashboard = useDashboardStore(state => state.dashboard);
  const weakAreas = dashboard?.weakAreas ?? [];
  const recommendedReview = dashboard?.recommendedReview;

  const { colors } = useThemeStore();
  const styles = getWeakAreasCardStyles(colors);

  if (weakAreas.length === 0) {
    return null; 
  }

  const remainingTopics = weakAreas.filter(topic => topic !== recommendedReview?.topic);

  return (
    <View style={styles.weakAreasCard}>
      <Text style={styles.sectionTitle}>Learning Coach</Text>

      {recommendedReview && (
        <View style={styles.smartReviewContainer}>
          <View style={styles.headerRow}>
            <View style={styles.iconBadge}>
              <Feather name="target" size={16} color={colors.primary} />
            </View>
            <Text style={styles.smartReviewBadge}>Recommended Review</Text>
          </View>

          <Text style={styles.smartReviewText}>
            {recommendedReview.message}
          </Text>

          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => console.log(`Start Quick Quiz for: ${recommendedReview.topic}`)}
          >
            <Text style={styles.actionButtonText}>Start 3-Min Quiz</Text>
            <Feather name="arrow-right" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {remainingTopics.length > 0 && (
        <>
          <Text style={styles.subtitle}>Other areas to watch:</Text>
          <View style={styles.chipsContainer}>
            {remainingTopics.map(topic => (
              <TouchableOpacity key={topic} style={styles.chip} activeOpacity={0.7}>
                <Text style={styles.chipText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default WeakAreasCard;