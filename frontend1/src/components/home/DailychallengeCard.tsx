import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useQuizStore } from "../../store/quizStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const DailyChallengeCard = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const { dailyChallenge, fetchDailyChallenge, isLoading } = useQuizStore();

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Daily Challenge</Text>
        <View style={[styles.card, styles.loaderCard]}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  if (!dailyChallenge) {
    return null;
  }

  const questionCount = dailyChallenge.questions?.length || 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Daily Challenge</Text>

      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name="zap" size={28} color={colors.warning || "#F59E0B"} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Today's Challenge</Text>
            <Text style={styles.subtitle}>
              Complete today's quiz to maintain your streak and earn bonus XP.
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Feather name="layers" size={14} color={colors.primary} />
            <Text style={styles.statText}>{questionCount} Questions</Text>
          </View>

          <View style={styles.statPill}>
            <Feather name="star" size={14} color={colors.warning} />
            <Text style={styles.statText}>+50 XP</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={() =>
            navigation.navigate("Quiz", {
              attemptId: "daily-challenge",
              questions: dailyChallenge.questions,
            })
          }
        >
          <Text style={styles.buttonText}>Start Challenge</Text>
          <Feather name="arrow-right" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      marginBottom: 32,
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
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 24,
      elevation: 4,
    },
    loaderCard: {
      height: 200,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: "rgba(245, 158, 11, 0.1)", // Light warning tint
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    statsRow: {
      flexDirection: "row",
      marginTop: 20,
      gap: 12,
    },
    statPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.05)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(37,99,235,0.1)",
      gap: 6,
    },
    statText: {
      color: colors.textPrimary,
      fontWeight: "700",
      fontSize: 13,
    },
    button: {
      marginTop: 24,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: colors.white,
      fontWeight: "800",
      fontSize: 15,
    },
  });

export default DailyChallengeCard;