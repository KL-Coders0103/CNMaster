import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { AssignmentStatus } from "../../types/assignment";
import { useThemeStore } from "../../store/themeStore";

type Props = {
  status: AssignmentStatus;
};

const AssignmentStatusBadge = ({ status }: Props) => {
  const { colors } = useThemeStore();

  // Helper to cleanly format "RESUBMISSION_REQUIRED" -> "Resubmission Required"
  const formatStatusText = (text: string) => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Maps statuses securely to our ThemePalette tokens
  // "1A" is appended safely assuming your theme uses standard 6-digit hex codes (10% opacity)
  const getStatusConfig = () => {
    switch (status) {
      case "PENDING":
        return { color: colors.warning, bg: `${colors.warning}1A` };
      case "SUBMITTED":
        return { color: colors.primary, bg: `${colors.primary}1A` };
      case "REVIEWED":
        return { color: colors.success, bg: `${colors.success}1A` };
      case "REJECTED":
      case "OVERDUE":
        return { color: colors.error, bg: `${colors.error}1A` };
      case "RESUBMISSION_REQUIRED":
        // Fallback for custom unique colors not explicitly in the palette
        return { color: "#8B5CF6", bg: "#8B5CF61A" }; 
      default:
        return { color: colors.textSecondary, bg: "rgba(0,0,0,0.05)" };
    }
  };

  const { color, bg } = getStatusConfig();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>
        {formatStatusText(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3, // Adds a premium feel to small, bold text
  },
});

export default AssignmentStatusBadge;