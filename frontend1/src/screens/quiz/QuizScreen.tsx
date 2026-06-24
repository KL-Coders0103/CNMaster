import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { QuizStackParamList } from "../../navigation/QuizStackNavigator";
import { useQuizStore } from "../../store/quizStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type Props = NativeStackScreenProps<QuizStackParamList, "Quiz">;

const QuizScreen = ({ route, navigation }: Props) => {
  const { questions, attemptId } = route.params;
  const { submitQuiz } = useQuizStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); 

  const latestAnswers = useRef(answers);
  useEffect(() => {
    latestAnswers.current = answers;
  }, [answers]);

  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyStateContainer}>
          <Feather name="alert-circle" size={48} color={colors.warning} />
          <Text style={styles.emptyStateTitle}>No Questions Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            This quiz currently has no questions available. Please select a different topic.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[index];
  const selectedAnswer = answers.find(
    (item) => item.questionId === currentQuestion.id
  )?.selectedAnswer;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = async () => {
    try {
      setIsSubmitting(true);
      await submitQuiz(latestAnswers.current);
      navigation.replace("QuizResult", { attemptId });
    } catch (error) {
      Alert.alert("Error", "Failed to submit automatically. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await submitQuiz(answers);
      navigation.replace("QuizResult", { attemptId });
    } catch (error) {
      Alert.alert("Error", "Failed to submit quiz. Please try again.");
      setIsSubmitting(false); // Only set false if it fails, otherwise it replaces the screen!
    }
  };

  const handleQuit = () => {
    Alert.alert("Exit Quiz", "Are you sure? Your progress will be lost.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Quit",
        style: "destructive",
        onPress: () => navigation.popToTop(), 
      },
    ]);
  };

  const selectAnswer = (selected: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter(
        (item) => item.questionId !== currentQuestion.id
      );
      return [
        ...filtered,
        {
          questionId: currentQuestion.id,
          selectedAnswer: selected,
        },
      ];
    });
  };

  const nextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPercentage = ((index + 1) / questions.length) * 100;
  const isTimeRunningOut = timeLeft < 60;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.iconButton}>
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.progressText}>
          {index + 1} of {questions.length}
        </Text>

        <View style={[styles.timerBadge, isTimeRunningOut && styles.timerBadgeWarning]}>
          <Feather 
            name="clock" 
            size={14} 
            color={isTimeRunningOut ? colors.error : colors.primary} 
          />
          <Text style={[styles.timerText, isTimeRunningOut && { color: colors.error }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.question}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {(currentQuestion.options as string[]).map((option) => {
            const isSelected = selectedAnswer === option;

            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.7}
                onPress={() => selectAnswer(option)}
                style={[styles.option, isSelected && styles.optionSelected]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>

                {isSelected ? (
                  <Feather name="check-circle" size={20} color={colors.white} />
                ) : (
                  <View style={styles.emptyCircle} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {index === questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.submitButton, (!selectedAnswer || isSubmitting) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!selectedAnswer || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Text style={styles.buttonText}>Submit Quiz</Text>
                <Feather name="check" size={20} color={colors.white} style={styles.btnIcon} />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, (!selectedAnswer || isSubmitting) && styles.buttonDisabled]}
            onPress={nextQuestion}
            disabled={!selectedAnswer || isSubmitting} 
          >
            <Text style={styles.buttonText}>Next Question</Text>
            <Feather name="arrow-right" size={20} color={colors.white} style={styles.btnIcon} />
          </TouchableOpacity>
        )}
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
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 32,
    },
    emptyStateTitle: {
      marginTop: 16,
      fontSize: 20,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    emptyStateSubtitle: {
      marginTop: 8,
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    progressText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    timerBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.1)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      gap: 6,
    },
    timerBadgeWarning: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
    timerText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
      fontVariant: ["tabular-nums"], 
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: colors.border,
      width: "100%",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: colors.primary,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 40,
      flexGrow: 1,
    },
    question: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.textPrimary,
      lineHeight: 34,
      letterSpacing: -0.5,
    },
    optionsContainer: {
      marginTop: 32,
      gap: 16,
    },
    option: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    optionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    optionText: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 24,
      paddingRight: 16,
    },
    optionTextSelected: {
      color: colors.white,
    },
    emptyCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      opacity: 0.3,
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
      borderRadius: 20,
      paddingVertical: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    submitButton: {
      flexDirection: "row",
      backgroundColor: colors.success,
      borderRadius: 20,
      paddingVertical: 18,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "700",
    },
    btnIcon: {
      marginLeft: 8,
    },
  });

export default QuizScreen;