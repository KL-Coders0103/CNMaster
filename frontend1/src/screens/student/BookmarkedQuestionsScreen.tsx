import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { getBookmarks } from "../../services/bookmarkService";

const BookmarkedQuestionsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const response = await getBookmarks();
      // Ensure we fallback to an empty array if data is malformed
      setBookmarks(response?.data?.data || []);
    } catch (error) {
      console.log("Failed to load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <View style={styles.card}>
        <View style={styles.questionRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Q{index + 1}</Text>
          </View>
          <Feather name="bookmark" size={20} color={colors.primary} />
        </View>

        <Text style={styles.question}>
          {item.question?.question || "Unknown Question"}
        </Text>

        <View style={styles.answerBox}>
          <Feather name="check-circle" size={16} color={colors.success || "#10B981"} />
          <Text style={styles.answer}>
            {item.question?.correctAnswer}
          </Text>
        </View>

        {/* Prevent crash if explanation is an empty string */}
        {item.question?.explanation && item.question.explanation.trim() !== "" ? (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>Explanation</Text>
            <Text style={styles.explanationText}>{item.question.explanation}</Text>
          </View>
        ) : null}
      </View>
    ),
    [colors]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Questions</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          style={styles.container}
          contentContainerStyle={
            bookmarks.length === 0 ? styles.emptyContent : styles.content
          }
          showsVerticalScrollIndicator={false}
          data={bookmarks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="bookmark" size={32} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
              <Text style={styles.emptySubtitle}>
                Save difficult questions during quizzes to review them here later.
              </Text>
            </View>
          }
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
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    loaderContainer: {
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
    emptyContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    card: {
      padding: 20,
      borderRadius: 24,
      marginBottom: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    questionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    badge: {
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.1)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },
    question: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: 24,
      marginBottom: 16,
    },
    answerBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    answer: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: "600",
      color: colors.success || "#10B981",
    },
    explanationBox: {
      marginTop: 16,
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
      letterSpacing: 0.5,
    },
    explanationText: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textPrimary,
    },
    emptyContainer: {
      alignItems: "center",
    },
    emptyIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    emptySubtitle: {
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      fontSize: 14,
    },
  });

export default BookmarkedQuestionsScreen;