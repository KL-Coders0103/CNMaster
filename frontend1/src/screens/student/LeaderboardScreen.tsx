import React, { useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { useProfileStore } from "../../store/profileStore";
import { ThemePalette } from "../../theme/colors";

const LeaderboardScreen = () => {
  const { leaderboard, currentUserRank, fetchLeaderboard } = useProfileStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#F59E0B"; 
    if (rank === 2) return "#9CA3AF"; 
    if (rank === 3) return "#D97706"; 
    return colors.textSecondary; 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={styles.rankBadge}>
          <Feather name="bar-chart-2" size={16} color={colors.primary} />
          <Text style={styles.rankText}>
            Your Rank: #{currentUserRank ?? "-"}
          </Text>
        </View>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isTop3 = item.rank <= 3;
          const rankColor = getRankColor(item.rank);

          return (
            <View style={[styles.card, isTop3 && { borderColor: rankColor, borderWidth: 1 }]}>
              
              <View style={styles.leftSection}>
                <View style={[styles.rankCircle, isTop3 && { backgroundColor: `${rankColor}15` }]}>
                  {isTop3 ? (
                    <Feather name="award" size={20} color={rankColor} />
                  ) : (
                    <Text style={[styles.rankNumber, { color: rankColor }]}>{item.rank}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.nameText}>{item.fullName}</Text>
                  <Text style={styles.levelText}>Level {item.level}</Text>
                </View>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.xpText}>{item.xp} XP</Text>
              </View>
              
            </View>
          );
        }}
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
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 12,
    gap: 6,
  },
  rankText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
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
  rankCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: "800",
  },
  nameText: {
    fontWeight: "700",
    fontSize: 16,
    color: colors.textPrimary,
  },
  levelText: {
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
    fontSize: 16,
  },
});

export default LeaderboardScreen;