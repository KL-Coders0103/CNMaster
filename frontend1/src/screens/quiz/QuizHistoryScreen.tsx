import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
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

const QuizHistoryScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await api.get("/quizzes/history");
      setHistory(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <Feather name="award" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.scoreTitle}>Quiz Score</Text>
            <Text style={styles.score}>
              {item.score} / {item.totalMarks}
            </Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <Feather name="calendar" size={14} color={colors.textSecondary} />
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>
    ),
    [colors]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz History</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        style={styles.container}
        contentContainerStyle={history.length === 0 ? styles.emptyContent : styles.content}
        showsVerticalScrollIndicator={false}
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyContainer}>
               <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="inbox" size={32} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No Quiz History</Text>
              <Text style={styles.emptySubtitle}>
                Complete quizzes to start tracking your performance and history.
              </Text>
            </View>
          )
        }
      />
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
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    iconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    scoreTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 2,
    },
    score: {
      fontWeight: "800",
      fontSize: 18,
      color: colors.textPrimary,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    date: {
      marginLeft: 8,
      fontSize: 13,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    emptyContainer: {
      alignItems: "center",
      paddingHorizontal: 32,
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

export default QuizHistoryScreen;