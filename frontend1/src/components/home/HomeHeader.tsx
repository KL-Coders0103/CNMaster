import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons"; 
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";

import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const HomeHeader = () => {
  const navigation = useNavigation<any>();
  const { dashboard, isOffline, setOfflineStatus } = useDashboardStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });
    return () => unsubscribe(); 
  }, [setOfflineStatus]);

  const hour = new Date().getHours();
  let greetingText = "Good Night";
  let iconName: keyof typeof Feather.glyphMap = "moon";
  let iconColor = colors.primary; 

  if (hour >= 5 && hour < 12) {
    greetingText = "Good Morning";
    iconName = "sun";
    iconColor = "#F59E0B"; 
  } else if (hour >= 12 && hour < 17) {
    greetingText = "Good Afternoon";
    iconName = "sun";
    iconColor = "#F59E0B"; 
  } else if (hour >= 17 && hour < 21) {
    greetingText = "Good Evening";
    iconName = "sunset"; 
    iconColor = "#F97316"; 
  }

  const progressPercentage = Math.min(
    ((dashboard?.xp.current ?? 0) / (dashboard?.xp.required ?? 100)) * 100,
    100
  );

  return (
    <View style={styles.container}>
      {/* Top Nav Row */}
      <View style={styles.topRow}>
        <View>
          <View style={styles.greetingRow}>
            <Feather name={iconName} size={18} color={iconColor} style={{ marginRight: 6 }} />
            <Text style={styles.greetingText}>{greetingText},</Text>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.username}>{dashboard?.user.fullName ?? "Student"}</Text>
            {isOffline && <Feather name="cloud-off" size={16} color="#EF4444" style={{ marginLeft: 8 }} />}
          </View>
        </View>

        <View style={styles.iconContainer}>
          {/* SEARCH BUTTON WIRED UP */}
          <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Search")} 
          >
            <Feather name="search" size={22} color={colors.textPrimary} /> 
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7} 
            onPress={() => {
              navigation.navigate("Notifications");
            }}
          >
            <View>
              <Feather name="bell" size={22} color={colors.textPrimary} />
              {(dashboard?.notificationsCount ?? 0) > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{dashboard?.notificationsCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statsTop}>
          <View style={styles.statPill}>
            <Feather name="trending-up" size={16} color="#EF4444" />
            <Text style={styles.statText}>{dashboard?.streak.days ?? 0} Day Streak</Text>
          </View>
          <View style={styles.statPill}>
            <Feather name="award" size={16} color="#8B5CF6" />
            <Text style={styles.statText}>Level {dashboard?.xp.level ?? 1}</Text>
          </View>
        </View>

        <View style={styles.xpSection}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP Progress</Text>
            <Text style={styles.xpValue}>
              {dashboard?.xp.current ?? 0} / {dashboard?.xp.required ?? 100}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  statsBanner: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  statsTop: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  xpSection: {
    width: "100%",
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  xpValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});

export default HomeHeader;