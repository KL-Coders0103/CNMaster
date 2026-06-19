import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDashboardStore } from "../../store/dashboardStore"; 
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const WeakAreasCard = () => {
  const dashboard = useDashboardStore(state => state.dashboard);
  const weakAreas = dashboard?.weakAreas ?? [];
  const recommendedReview = dashboard?.recommendedReview;
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  if (weakAreas.length === 0) return null; 

  const remainingTopics = weakAreas.filter(topic => topic !== recommendedReview?.topic);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Learning Coach</Text>

      <View style={styles.card}>
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
          <View style={styles.chipsSection}>
            <Text style={styles.subtitle}>Other areas to watch:</Text>
            <View style={styles.chipsContainer}>
              {remainingTopics.map(topic => (
                <TouchableOpacity key={topic} style={styles.chip} activeOpacity={0.7}>
                  <Text style={styles.chipText}>{topic}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 40, // Extra bottom padding for scroll clearance
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  smartReviewContainer: {
    padding: 20,
    backgroundColor: "rgba(37, 99, 235, 0.05)", // Very subtle primary tint
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  smartReviewBadge: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  smartReviewText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  chipsSection: {
    padding: 20,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});

export default WeakAreasCard;