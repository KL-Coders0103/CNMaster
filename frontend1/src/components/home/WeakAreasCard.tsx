import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { useAnalyticsStore } from "../../store/analyticsStore";

const WeakAreasCard = () => {
  const navigation = useNavigation<any>();
  const weakAreas = useAnalyticsStore((state) => state.weakAreas);
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  if (!weakAreas || weakAreas.length === 0) {
    return null;
  }

  const recommendedTopic = weakAreas[0];
  const otherTopics = weakAreas.slice(1);

  // Safe fallback in case chapter data is missing
  const topicTitle = recommendedTopic?.chapter?.title || "this topic";

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Learning Coach</Text>

      <View style={styles.card}>
        {/* Recommended Focus Area */}
        <View style={styles.smartReviewContainer}>
          <View style={styles.headerRow}>
            <View style={styles.iconBadge}>
              <Feather name="crosshair" size={16} color={colors.primary} />
            </View>
            <Text style={styles.smartReviewBadge}>Recommended Focus</Text>
          </View>

          <Text style={styles.smartReviewText}>
            You seem to be struggling with <Text style={styles.highlightText}>{topicTitle}</Text>. 
            You have made {recommendedTopic.mistakeCount} mistakes in this area recently.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("QuizInstructions", {
                chapterId: recommendedTopic.chapter?.id,
                difficulty: "MEDIUM",
              })
            }
          >
            <Text style={styles.actionButtonText}>Review Topic Now</Text>
            <Feather name="arrow-right" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Other Weak Areas List */}
        {otherTopics.length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.listSubtitle}>Other areas to improve</Text>

            <View style={styles.listContainer}>
              {otherTopics.map((area) => (
                <TouchableOpacity
                  key={area.id}
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate("QuizInstructions", {
                      chapterId: area.chapter?.id,
                      difficulty: "MEDIUM",
                    })
                  }
                >
                  <View style={styles.listItemTextContainer}>
                    <Text style={styles.listItemTitle} numberOfLines={1}>
                      {area.chapter?.title || "Unknown Topic"}
                    </Text>
                    <Text style={styles.mistakeText}>
                      {area.mistakeCount} mistakes
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      marginBottom: 40,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 24,
      elevation: 4,
    },
    smartReviewContainer: {
      padding: 24,
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.05)",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    iconBadge: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    smartReviewBadge: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    smartReviewText: {
      color: colors.textPrimary,
      lineHeight: 24,
      fontSize: 15,
      marginBottom: 24,
    },
    highlightText: {
      color: colors.primary,
      fontWeight: "800",
    },
    actionButton: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      paddingVertical: 16,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    actionButtonText: {
      color: colors.white,
      fontWeight: "800",
      fontSize: 15,
    },
    listSection: {
      padding: 24,
      backgroundColor: colors.surface,
    },
    listSubtitle: {
      color: colors.textSecondary,
      marginBottom: 16,
      fontWeight: "700",
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    listContainer: {
      gap: 12,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    listItemTextContainer: {
      flex: 1,
      marginRight: 12,
    },
    listItemTitle: {
      color: colors.textPrimary,
      fontWeight: "700",
      fontSize: 15,
      marginBottom: 4,
    },
    mistakeText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.error || "#EF4444",
    },
  });

export default WeakAreasCard;