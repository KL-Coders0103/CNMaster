import React, { useEffect } from "react";
import { FlatList, Text, View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useProfileStore } from "../../store/profileStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // 2 columns with 20 padding on sides and 20 gap

const AchievementScreen = () => {
  const { achievements, fetchAchievements } = useProfileStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Your Badges</Text>
            <Text style={styles.headerSubtitle}>Complete tasks to unlock these achievements.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isUnlocked = item.unlocked;

          return (
            <View style={[styles.card, isUnlocked ? styles.cardUnlocked : styles.cardLocked]}>
              <View style={[styles.iconContainer, isUnlocked ? styles.iconUnlocked : styles.iconLocked]}>
                <Feather 
                  name={isUnlocked ? "award" : "lock"} 
                  size={28} 
                  color={isUnlocked ? colors.primary : colors.textSecondary} 
                />
              </View>
              
              <Text style={[styles.title, !isUnlocked && { color: colors.textSecondary }]} numberOfLines={2}>
                {item.title}
              </Text>
              
              <Text style={styles.description} numberOfLines={3}>
                {item.description}
              </Text>

              <View style={styles.xpBadge}>
                <Text style={styles.xpText}>+{item.xpReward} XP</Text>
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
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  cardUnlocked: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLocked: {
    borderColor: colors.border,
    opacity: 0.7,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconUnlocked: {
    backgroundColor: "rgba(37, 99, 235, 0.1)", // Light primary
  },
  iconLocked: {
    backgroundColor: colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
    flex: 1,
  },
  xpBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
  },
});

export default AchievementScreen;