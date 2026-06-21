import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAssignmentStore } from "../../store/assignmentStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const UpcomingAssignmentCard = () => {
  const navigation = useNavigation<any>();
  const { upcomingAssignment } = useAssignmentStore();
  const { colors } = useThemeStore();
  
  if (!upcomingAssignment) return null;

  // 1. Calculate if the assignment deadline has passed
  const isOverdue = new Date(upcomingAssignment.dueDate).getTime() < new Date().getTime();
  
  /* * OPTION B: If you prefer to HIDE overdue assignments entirely, 
   * simply uncomment the line below:
   * * if (isOverdue) return null; 
   */
  
  const styles = createStyles(colors, isOverdue);

  const formattedDate = new Date(upcomingAssignment.dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("Assignments", {
          screen: "AssignmentDetail",
          params: {
            assignmentId: upcomingAssignment.id,
          },
        })
      }
    >
      {/* Header / Eyebrow */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Feather 
            name={isOverdue ? "alert-circle" : "clipboard"} 
            size={18} 
            color={isOverdue ? colors.error : colors.primary} 
          />
        </View>
        <Text style={styles.headerTitle}>
          {isOverdue ? "Overdue Assignment" : "Upcoming Assignment"}
        </Text>
      </View>

      {/* Main Content */}
      <Text numberOfLines={2} style={styles.title}>
        {upcomingAssignment.title}
      </Text>

      {/* Footer / Due Date */}
      <View style={styles.footer}>
        <Feather 
          name="calendar" 
          size={14} 
          color={isOverdue ? colors.error : colors.textSecondary} 
        />
        <Text style={[styles.dueDateText, isOverdue && { color: colors.error }]}>
          {isOverdue ? `Was due ${formattedDate}` : `Due ${formattedDate}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// We pass isOverdue to dynamically alter borders and shadows
const createStyles = (colors: ThemePalette, isOverdue: boolean) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 20,
      marginBottom: 24,
      padding: 20,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      // Flash a red border if overdue
      borderColor: isOverdue ? "rgba(239, 68, 68, 0.4)" : colors.border,
      shadowColor: isOverdue ? colors.error : "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isOverdue ? 0.08 : 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: isOverdue ? "rgba(239, 68, 68, 0.1)" : (colors.primaryLight || "rgba(37,99,235,0.1)"),
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: isOverdue ? colors.error : colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 12,
      letterSpacing: -0.3,
      lineHeight: 24,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
    },
    dueDateText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
  });

export default UpcomingAssignmentCard;