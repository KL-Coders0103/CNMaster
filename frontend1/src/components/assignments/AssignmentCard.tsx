import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { Assignment } from "../../types/assignment";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import AssignmentStatusBadge from "./AssignmentStatusBadge";

type Props = {
  assignment: Assignment;
  onPress: () => void;
};

const AssignmentCard = ({ assignment, onPress }: Props) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const dueDate = new Date(assignment.dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* 1. Header Row: Icon + Info + Badge */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather
            name="file-text" // Swapped clipboard for file-text (often looks sleeker)
            size={20}
            color={colors.primary}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {assignment.title}
          </Text>
          <Text numberOfLines={1} style={styles.subject}>
            {assignment.chapter?.subject?.name || "Subject Name"}
          </Text>
        </View>

        {/* Badge moved to top right for a cleaner dashboard look */}
        <View style={styles.badgeContainer}>
          <AssignmentStatusBadge status={assignment.submissionStatus ?? "PENDING"} />
        </View>
      </View>

      {/* 2. Description */}
      {assignment.description ? (
        <Text numberOfLines={2} style={styles.description}>
          {assignment.description}
        </Text>
      ) : null}

      {/* 3. Footer (Chip Style) */}
      <View style={styles.footer}>
        <View style={[styles.footerChip, { backgroundColor: `${colors.primary}10` }]}>
          <Feather name="clock" size={14} color={colors.primary} />
          <Text style={[styles.footerChipText, { color: colors.primary }]}>
            Due {dueDate}
          </Text>
        </View>

        <View style={[styles.footerChip, { backgroundColor: `${colors.textSecondary}10` }]}>
          <Feather name="award" size={14} color={colors.textSecondary} />
          <Text style={[styles.footerChipText, { color: colors.textSecondary }]}>
            {assignment.totalMarks} Marks
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04, // Ultra-subtle, premium shadow
      shadowRadius: 12,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center", // Center aligns icon, text, and badge horizontally
      marginBottom: 12,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 14, // Squircle look
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primaryLight || "rgba(37,99,235,0.08)",
      marginRight: 12,
    },
    titleContainer: {
      flex: 1,
      justifyContent: "center",
      marginRight: 8, // Prevent text from touching the badge
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 2,
      letterSpacing: -0.3, // Modern font rendering
    },
    subject: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    badgeContainer: {
      flexShrink: 0, // Prevents the badge from being squished by long titles
    },
    description: {
      color: colors.textSecondary,
      lineHeight: 20,
      fontSize: 14,
      marginBottom: 16,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8, // Clean spacing between chips
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth, // Thinner, sharper border line
      borderTopColor: colors.border,
    },
    footerChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      gap: 6, // Space between icon and text inside chip
    },
    footerChipText: {
      fontWeight: "600",
      fontSize: 12,
      letterSpacing: 0.2,
    },
  });

export default AssignmentCard;