import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAssignmentStore } from "../../store/assignmentStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import AssignmentStatusBadge from "../../components/assignments/AssignmentStatusBadge";

const SubmissionHistoryScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const { submissionHistory, fetchSubmissionHistory, isLoading } =
    useAssignmentStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSubmissionHistory();
  }, [fetchSubmissionHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSubmissionHistory();
    setRefreshing(false);
  }, [fetchSubmissionHistory]);

  const renderHistoryItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.assignment?.title}
          </Text>
          <View style={styles.badgeContainer}>
            <AssignmentStatusBadge status={item.status} />
          </View>
        </View>

        {item.assignment?.chapter?.title ? (
          <Text style={styles.subjectText}>
            {item.assignment.chapter.title}
          </Text>
        ) : (
          <Text style={styles.subjectText}>
            Computer Networks
          </Text>
        )}

        {item.submittedAt ? (
          <View style={styles.detailRow}>
            <Feather name="clock" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              Submitted: {new Date(item.submittedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </Text>
          </View>
        ) : null}

        {(item.marksObtained !== null || (item.feedback && item.feedback.trim() !== "")) ? (
          <View style={styles.gradingContainer}>
            
            {item.marksObtained !== null ? (
              <View style={styles.marksRow}>
                <Feather name="award" size={16} color={colors.primary} />
                <Text style={styles.marksText}>
                  Score: <Text style={{ color: colors.textPrimary }}>{item.marksObtained}</Text> / {item.assignment?.totalMarks}
                </Text>
              </View>
            ) : null}

            {(item.feedback && item.feedback.trim() !== "") ? (
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackLabel}>Instructor Feedback:</Text>
                <Text style={styles.feedbackText}>{item.feedback}</Text>
              </View>
            ) : null}

          </View>
        ) : null}
      </View>
    ),
    [colors]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submission History</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={submissionHistory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={48} color={colors.textMuted || colors.placeholder} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No Submissions Yet</Text>
              <Text style={styles.emptySubtitle}>
                When you complete assignments, your history and grades will appear here.
              </Text>
            </View>
          ) : null
        }
        renderItem={renderHistoryItem}
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
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
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
    listContent: {
      padding: 16,
      paddingBottom: 40,
      flexGrow: 1,
    },
    card: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 24,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    cardTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
      lineHeight: 24,
    },
    badgeContainer: {
      marginTop: 2,
    },
    subjectText: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      gap: 6,
    },
    detailText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: "500",
    },
    gradingContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    marksRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    marksText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    feedbackBox: {
      marginTop: 12,
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    feedbackLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    feedbackText: {
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 20,
      fontStyle: "italic",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 80,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      marginBottom: 16,
      opacity: 0.8,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
    },
    emptySubtitle: {
      marginTop: 8,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

export default SubmissionHistoryScreen;