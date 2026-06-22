import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { api } from "../../api/axios";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const QuizResultScreen = ({ route, navigation }: any) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      const response = await api.get(`/quizzes/result/${route.params.attemptId}`);
      setResult(response.data.data);
    } catch (err) {
      console.log(err);
      setError(true);
      Alert.alert("Error", "Could not load quiz results. Please try again.");
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.loader}>
        <Feather name="alert-triangle" size={48} color={colors.error} />
        <Text style={{ marginTop: 16, color: colors.textPrimary, fontWeight: "600" }}>
          Failed to load results
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.popToTop()}>
          <Text style={styles.primaryText}>Go Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Celebration Hero */}
        <View style={styles.heroCircle}>
          <Feather name="award" size={64} color={colors.warning} />
        </View>
        <Text style={styles.title}>Quiz Completed!</Text>
        <Text style={styles.subtitle}>Great job finishing the challenge.</Text>

        {/* Stats Grid */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Score</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{result.score}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>{result.correctAnswers}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Wrong</Text>
            <Text style={[styles.statValue, { color: colors.error }]}>{result.wrongAnswers}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("QuizReview", { attemptId: route.params.attemptId })}
          >
            <Feather name="book-open" size={18} color={colors.primary} style={styles.btnIcon} />
            <Text style={styles.secondaryText}>Review Answers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.primaryText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

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
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 24,
    },
    container: {
      flex: 1,
      alignItems: "center",
      padding: 24,
      paddingTop: 60,
    },
    heroCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(245, 158, 11, 0.1)", // Light warning orange
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
      marginBottom: 40,
    },
    statsCard: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      width: "100%",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    divider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 12,
    },
    statLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    statValue: {
      fontSize: 28,
      fontWeight: "800",
    },
    actionContainer: {
      width: "100%",
      marginTop: "auto", // Pushes buttons to the bottom
      marginBottom: 20,
      gap: 16,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 18,
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    secondaryButton: {
      flexDirection: "row",
      borderRadius: 20,
      padding: 18,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.primaryLight || "rgba(37,99,235,0.2)",
      backgroundColor: colors.surface,
    },
    primaryText: {
      color: colors.white,
      fontWeight: "700",
      fontSize: 16,
    },
    secondaryText: {
      color: colors.primary,
      fontWeight: "700",
      fontSize: 16,
    },
    btnIcon: {
      marginRight: 8,
    },
  });

export default QuizResultScreen;