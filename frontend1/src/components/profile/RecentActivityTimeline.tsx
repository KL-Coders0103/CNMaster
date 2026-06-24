import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native"; // CRITICAL: Import ScrollView
import { Feather } from "@expo/vector-icons";

import { useActivityStore } from "../../store/activityStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const RecentActivityTimeline = () => {
  const { activities, fetchActivities } = useActivityStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (!activities || activities.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Feather name="activity" size={18} color={colors.textPrimary} />
          </View>
          <Text style={styles.title}>Recent Activity</Text>
        </View>
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <Feather name="wind" size={32} color={colors.textSecondary} style={{ marginBottom: 12, opacity: 0.5 }} />
          <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 15 }}>It's quiet here...</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>Read notes or complete quizzes to see your activity.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Feather name="activity" size={18} color={colors.textPrimary} />
        </View>
        <Text style={styles.title}>Recent Activity</Text>
      </View>

      {/* CRITICAL FIX: Changed View to ScrollView, added nestedScrollEnabled */}
      <ScrollView 
        style={styles.timelineContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true} 
      >
        {activities.map((activity, index) => (
          <View key={activity.id} style={styles.item}>

            <View style={styles.timelineGraphic}>
              <View style={styles.dot} />
              {index !== activities.length - 1 && <View style={styles.line} />}
            </View>

            <View style={styles.content}>
              <Text style={styles.action}>{activity.action}</Text> 
              <Text style={styles.date}>
                {activity.createdAt ? new Date(activity.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                }) : "Just now"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      padding: 20,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    headerIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    timelineContainer: {
      paddingLeft: 4,
      maxHeight: 300, // CRITICAL FIX: Restrict height so it actually scrolls instead of expanding the card forever
    },
    item: {
      flexDirection: "row",
    },
    timelineGraphic: {
      alignItems: "center",
      marginRight: 16,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
      marginTop: 4,
    },
    line: {
      width: 2,
      flex: 1,
      backgroundColor: colors.border,
      marginTop: 4,
      marginBottom: 4,
    },
    content: {
      flex: 1,
      paddingBottom: 24, 
    },
    action: {
      color: colors.textPrimary,
      fontWeight: "600",
      lineHeight: 22,
      fontSize: 14,
    },
    date: {
      marginTop: 4,
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

export default RecentActivityTimeline;