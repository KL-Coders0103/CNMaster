import React, { useEffect } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useProfileStore } from "../../store/profileStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const ActivityHistoryScreen = () => {
  const { activityHistory, fetchActivityHistory } = useProfileStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchActivityHistory();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity History</Text>
        <Text style={styles.headerSubtitle}>Track your daily progress and XP gains.</Text>
      </View>

      <FlatList
        data={activityHistory}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="clock" size={32} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyText}>No activity yet.</Text>
            <Text style={styles.emptySubText}>Start learning to earn your first XP!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <View style={styles.iconContainer}>
                <Feather name="calendar" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.activityLabel}>Daily Activity</Text>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.xpText}>+{item.xp}</Text>
              <Text style={styles.xpLabel}>XP</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
    gap: 12,
    flexGrow: 1, // Ensures empty state centers vertically
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(37, 99, 235, 0.1)", // Light primary tint
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  activityLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  xpText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 18,
  },
  xpLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: -2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default ActivityHistoryScreen;