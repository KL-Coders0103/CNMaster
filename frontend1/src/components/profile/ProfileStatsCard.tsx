import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type Props = {
  streak: number;
  xp: number;
  achievements: number;
};

const ProfileStatsCard = ({ streak, xp, achievements }: Props) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={[styles.iconWrapper, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
          {/* Changed 'flame' to 'trending-up' */}
          <Feather name="trending-up" size={22} color="#EF4444" /> 
        </View>
        <Text style={styles.value}>{streak}</Text>
        <Text style={styles.label}>Streak</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <View style={[styles.iconWrapper, { backgroundColor: "rgba(37, 99, 235, 0.15)" }]}>
          <Feather name="zap" size={22} color={colors.primary} />
        </View>
        <Text style={styles.value}>{xp}</Text>
        <Text style={styles.label}>XP Earned</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <View style={[styles.iconWrapper, { backgroundColor: "rgba(139, 92, 246, 0.15)" }]}>
          <Feather name="award" size={22} color="#8B5CF6" />
        </View>
        <Text style={styles.value}>{achievements}</Text>
        <Text style={styles.label}>Badges</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 24,
    borderRadius: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: colors.border,
  },
});

export default ProfileStatsCard;