import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { QuizStackParamList } from "../../navigation/QuizStackNavigator";
import { useQuizStore } from "../../store/quizStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type Props = NativeStackScreenProps<QuizStackParamList, "QuizInstructions">;

const QuizInstructionsScreen = ({ route, navigation }: Props) => {
  const { chapterId, difficulty } = route.params;
  const { startQuiz, isLoading } = useQuizStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const handleStart = async () => {
    try {
      const data = await startQuiz(chapterId, difficulty);
      
      if (!data || !data.attemptId) {
        throw new Error("Invalid quiz data received");
      }

      navigation.replace("Quiz", {
        attemptId: data.attemptId,
        questions: data.questions,
      });
    } catch (error: any) {
      // CRITICAL FIX: Gracefully handle the empty database 404
      const backendMessage = error.response?.data?.message;
      
      if (error.response?.status === 404 && backendMessage) {
        Alert.alert(
          "Coming Soon!", 
          backendMessage, // This will print "No questions found..."
          [{ text: "Got it" }]
        );
      } else {
        Alert.alert(
          "Error Starting Quiz",
          "We couldn't load the questions. Please check your connection and try again.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const rules = [
    { icon: "help-circle", text: "Total Questions: 10" },
    { icon: "bar-chart", text: `Difficulty Level: ${difficulty}` },
    { icon: "check-circle", text: "Each question carries 1 mark" },
    { icon: "shield", text: "No negative marking for wrong answers" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          disabled={isLoading}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Feather name="file-text" size={32} color={colors.primary} />
        </View>

        <Text style={styles.title}>Before you begin</Text>
        <Text style={styles.subtitle}>
          Please read the instructions carefully before starting the timer.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quiz Guidelines</Text>
          
          <View style={styles.rulesContainer}>
            {rules.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <Feather name={rule.icon as any} size={18} color={colors.primary} />
                <Text style={styles.ruleText}>{rule.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Highlighted Warning Box */}
        <View style={styles.warningBox}>
          <Feather name="clock" size={20} color={colors.warning} />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>Time Limit</Text>
            <Text style={styles.warningText}>
              You have 10 minutes. The quiz will automatically submit when the timer ends.
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={isLoading}
          onPress={handleStart}
          activeOpacity={0.8}
          style={[styles.button, isLoading && styles.buttonDisabled]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.buttonText}>Start Quiz Now</Text>
              <Feather name="arrow-right" size={20} color={colors.white} style={styles.btnIcon} />
            </>
          )}
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
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 10,
    },
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 32,
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
      marginBottom: 24,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 20,
    },
    rulesContainer: {
      gap: 16,
    },
    ruleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    ruleText: {
      marginLeft: 12,
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    warningBox: {
      flexDirection: "row",
      backgroundColor: "rgba(245, 158, 11, 0.1)", // Light warning orange
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: "rgba(245, 158, 11, 0.3)",
      alignItems: "flex-start",
    },
    warningTextContainer: {
      marginLeft: 12,
      flex: 1,
    },
    warningTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.warning,
      marginBottom: 4,
    },
    warningText: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textPrimary,
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
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: colors.white,
      fontWeight: "700",
      fontSize: 16,
    },
    btnIcon: {
      marginLeft: 8,
    },
  });

export default QuizInstructionsScreen;