import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { AssignmentStackParamList } from "../../navigation/AssignmentStackNavigator";
import { useAssignmentStore } from "../../store/assignmentStore";
import { useThemeStore } from "../../store/themeStore";
import { pickSubmissionFile } from "../../utils/documentPicker";
import AssignmentStatusBadge from "../../components/assignments/AssignmentStatusBadge";
import { ThemePalette } from "../../theme/colors";

type Props = NativeStackScreenProps<AssignmentStackParamList, "AssignmentDetail">;

const AssignmentDetailScreen = ({ route, navigation }: Props) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  
  const { assignmentId } = route.params;
  const {
    assignment,
    isLoading,
    fetchAssignmentDetails,
    submitStudentAssignment,
  } = useAssignmentStore();

  // Local UI States for async actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchAssignmentDetails(assignmentId);
  }, [assignmentId, fetchAssignmentDetails]);

  const handleSubmission = async () => {
    const file = await pickSubmissionFile();
    if (!file) return;

    try {
      setIsSubmitting(true);
      await submitStudentAssignment(assignmentId, file);
      Toast.show({
        type: "success",
        text1: "Assignment submitted successfully",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Submission failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!assignment) return;
    
    try {
      setIsDownloading(true);
      const fileUri = FileSystem.documentDirectory + `${assignment.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      const result = await FileSystem.downloadAsync(assignment.assignmentUrl, fileUri);
      
      await Sharing.shareAsync(result.uri);
      Toast.show({
        type: "success",
        text1: "Assignment downloaded",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Download failed",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getRemainingTime = () => {
    if (!assignment) return { text: "", isOverdue: false };
    
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff <= 0) return { text: "Overdue", isOverdue: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return { text: `${days} days left`, isOverdue: false };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    return { text: `${hours} hours left`, isOverdue: false };
  };

  if (isLoading || !assignment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const remainingTime = getRemainingTime();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.description}>{assignment.description}</Text>

        {/* Quick Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Feather name="calendar" size={16} color={colors.primary} />
            <Text style={styles.statText}>
              Due: {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          </View>

          <View style={styles.statBadge}>
            <Feather name="award" size={16} color={colors.warning} />
            <Text style={styles.statText}>{assignment.totalMarks} Marks</Text>
          </View>

          <View style={[styles.statBadge, remainingTime.isOverdue && styles.statBadgeOverdue]}>
            <Feather name="clock" size={16} color={remainingTime.isOverdue ? colors.error : colors.textSecondary} />
            <Text style={[styles.statText, remainingTime.isOverdue && { color: colors.error }]}>
              {remainingTime.text}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsText}>{assignment.instructions}</Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Submission Status</Text>
            <AssignmentStatusBadge status={assignment.submissionStatus} />
          </View>

          {/* FIX: Strict Ternary for submittedAt */}
          {assignment.submittedAt ? (
            <View style={styles.statusRow}>
              <Feather name="check-circle" size={16} color={colors.success} />
              <Text style={styles.statusDetailText}>
                Submitted: {new Date(assignment.submittedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </Text>
            </View>
          ) : null}

          {/* FIX: Strict Ternary for marksObtained */}
          {assignment.marksObtained !== null ? (
            <View style={styles.statusRow}>
              <Feather name="star" size={16} color={colors.warning} />
              <Text style={styles.statusDetailTextHighlight}>
                Graded: {assignment.marksObtained} / {assignment.totalMarks} Marks
              </Text>
            </View>
          ) : null}

          {/* FIX: Strict Ternary for feedback */}
          {assignment.feedback ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackLabel}>Instructor Feedback:</Text>
              <Text style={styles.feedbackText}>{assignment.feedback}</Text>
            </View>
          ) : null}
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Feather name="download" size={20} color={colors.primary} style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>Download Assignment</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, (isSubmitting || isLoading) && styles.buttonDisabled]}
          onPress={handleSubmission}
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Feather name="upload-cloud" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>
                {assignment.submissionStatus === "PENDING" ? "Submit Assignment" : "Resubmit Assignment"}
              </Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  description: {
    color: colors.textSecondary,
    marginTop: 12,
    lineHeight: 24,
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    gap: 12,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  statBadgeOverdue: {
    backgroundColor: "rgba(239, 68, 68, 0.1)", // Light red tint
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionTitle: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  instructionsBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionsText: {
    lineHeight: 24,
    color: colors.textSecondary,
    fontSize: 15,
  },
  statusCard: {
    marginTop: 32,
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  statusDetailText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  statusDetailTextHighlight: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  feedbackBox: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  feedbackLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  feedbackText: {
    color: colors.textPrimary,
    lineHeight: 22,
    fontStyle: "italic",
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primaryLight || "rgba(79, 70, 229, 0.2)",
    backgroundColor: colors.surface,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default AssignmentDetailScreen;