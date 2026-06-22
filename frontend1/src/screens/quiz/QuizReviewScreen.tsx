import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { api } from "../../api/axios";

const QuizReviewScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local state to instantly show bookmark toggle without waiting for API
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    try {
      const response = await api.get(`/quizzes/result/${route.params.attemptId}`);
      setAnswers(response.data.data.quizAnswers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (questionId: string) => {
    // Optimistic UI update
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });

    try {
      await api.post(`/bookmarks/${questionId}`);
    } catch (error) {
      console.log("Bookmark failed", error);
      // Revert if failed
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(questionId)) next.delete(questionId);
        else next.add(questionId);
        return next;
      });
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isBookmarked = bookmarkedIds.has(item.question.id);

      return (
        <View style={[styles.card, { borderColor: item.isCorrect ? colors.success : colors.error }]}>
          <View style={styles.questionRow}>
            <Text style={styles.question}>
              <Text style={{ color: colors.textSecondary }}>{index + 1}. </Text>
              {item.question.question}
            </Text>
            <TouchableOpacity onPress={() => toggleBookmark(item.question.id)} style={styles.bookmarkBtn}>
              <Feather
                name="bookmark"
                size={22}
                color={isBookmarked ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.answerBlock}>
            <View style={styles.answerRow}>
              <Feather name={item.isCorrect ? "check-circle" : "x-circle"} size={16} color={item.isCorrect ? colors.success : colors.error} />
              <Text style={[styles.answerText, { color: item.isCorrect ? colors.success : colors.error }]}>
                Your Answer: {item.selectedAnswer || "Skipped"}
              </Text>
            </View>

            {!item.isCorrect && (
              <View style={[styles.answerRow, { marginTop: 8 }]}>
                <Feather name="check" size={16} color={colors.success} />
                <Text style={styles.correctAnswerText}>
                  Correct Answer: {item.question.correctAnswer}
                </Text>
              </View>
            )}
          </View>

          {/* FIX: Strict ternary to prevent text crash */}
          {item.question.explanation && item.question.explanation.trim() !== "" ? (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>Explanation</Text>
              <Text style={styles.explanationText}>{item.question.explanation}</Text>
            </View>
          ) : null}
        </View>
      );
    },
    [colors, bookmarkedIds]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Answers</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          data={answers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    card: {
      padding: 20,
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    questionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    question: {
      flex: 1,
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: 24,
      marginRight: 16,
    },
    bookmarkBtn: {
      padding: 4,
    },
    answerBlock: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
    },
    answerRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    answerText: {
      marginLeft: 8,
      fontWeight: "600",
      fontSize: 14,
    },
    correctAnswerText: {
      marginLeft: 8,
      fontWeight: "600",
      fontSize: 14,
      color: colors.success,
    },
    explanationBox: {
      marginTop: 8,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    explanationLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    explanationText: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textPrimary,
    },
  });

export default QuizReviewScreen;