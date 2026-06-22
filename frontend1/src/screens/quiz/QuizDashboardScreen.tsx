import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

const QuizDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("EASY");

  // TODO: Replace with the actual selected chapter ID from your app state
  const activeChapterId = "REPLACE_WITH_REAL_ID"; 

  const handleStartQuiz = () => {
    navigation.navigate("QuizInstructions", {
      chapterId: activeChapterId,
      difficulty: selectedDifficulty,
    });
  };

  const difficultyLevels: { level: Difficulty; icon: string; label: string }[] = [
    { level: "EASY", icon: "smile", label: "Easy" },
    { level: "MEDIUM", icon: "activity", label: "Medium" },
    { level: "HARD", icon: "zap", label: "Hard" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconWrapper}>
            <Feather name="target" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Quiz Center</Text>
          <Text style={styles.subtitle}>
            Test your networking knowledge, earn XP, and conquer your weak areas.
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="award" size={20} color={colors.warning} />
            <Text style={styles.cardTitle}>Today's Challenge</Text>
          </View>
          <Text style={styles.cardDescription}>
            Complete a quiz today to maintain your learning streak and boost your leaderboard ranking.
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Feather name="clock" size={14} color={colors.textSecondary} />
              <Text style={styles.statText}>10 Mins</Text>
            </View>
            <View style={styles.statPill}>
              <Feather name="star" size={14} color={colors.warning} />
              <Text style={styles.statText}>+50 XP</Text>
            </View>
          </View>
        </View>

        {/* Difficulty Selector */}
        <Text style={styles.sectionTitle}>Select Difficulty</Text>
        <View style={styles.difficultyContainer}>
          {difficultyLevels.map((item) => {
            const isSelected = selectedDifficulty === item.level;
            return (
              <TouchableOpacity
                key={item.level}
                activeOpacity={0.7}
                onPress={() => setSelectedDifficulty(item.level)}
                style={[
                  styles.difficultyBox,
                  isSelected && styles.difficultyBoxSelected,
                ]}
              >
                <Feather 
                  name={item.icon as any} 
                  size={20} 
                  color={isSelected ? colors.primary : colors.textSecondary} 
                />
                <Text
                  style={[
                    styles.difficultyText,
                    isSelected && styles.difficultyTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleStartQuiz}
        >
          <Text style={styles.buttonText}>Start {selectedDifficulty} Quiz</Text>
          <Feather name="arrow-right" size={20} color={colors.white} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    heroSection: {
      marginTop: 10,
      marginBottom: 32,
    },
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      marginTop: 8,
      color: colors.textSecondary,
      lineHeight: 24,
      fontSize: 16,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
      marginBottom: 32,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginLeft: 8,
    },
    cardDescription: {
      color: colors.textSecondary,
      lineHeight: 22,
      fontSize: 14,
      marginBottom: 20,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
    },
    statPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statText: {
      marginLeft: 6,
      fontSize: 13,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 16,
    },
    difficultyContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    difficultyBox: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    difficultyBoxSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.05)",
    },
    difficultyText: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    difficultyTextSelected: {
      color: colors.primary,
    },
    footer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    button: {
      flexDirection: "row",
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "700",
    },
  });

export default QuizDashboardScreen;