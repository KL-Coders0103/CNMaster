import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"; 
import NetInfo from "@react-native-community/netinfo";

import { getHomeHeaderStyles } from "../../styles/components/home/homeHeaderStyles";
import { getHomeStatsStyles } from "../../styles/components/home/homeStatsStyles";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";

const HomeHeader = () => {
  const dashboard = useDashboardStore(state => state.dashboard);
  const markAsRead = useDashboardStore(state => state.markNotificationsAsRead); 
  const isOffline = useDashboardStore(state => state.isOffline);
  const setOfflineStatus = useDashboardStore(state => state.setOfflineStatus);

  const { colors } = useThemeStore();
  const headerStyles = getHomeHeaderStyles(colors);
  const statsStyles = getHomeStatsStyles(colors);

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
  let iconColor = colors.primaryDark; // 👈 Now using dynamic store colors

  if (hour >= 5 && hour < 12) {
    greetingText = "Good Morning";
    iconName = "sunrise";
    iconColor = colors.warning; 
  } else if (hour >= 12 && hour < 17) {
    greetingText = "Good Afternoon";
    iconName = "sun";
    iconColor = colors.warning; 
  } else if (hour >= 17 && hour < 21) {
    greetingText = "Good Evening";
    iconName = "sunset"; 
    iconColor = colors.primary; 
  }

  return (
    <View style={headerStyles.headerContainer}>
      <View style={headerStyles.topRow}>
        <View style={headerStyles.textColumn}>
          
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Text style={[headerStyles.greeting, { marginBottom: 0, marginRight: 6 }]}>
              {greetingText}
            </Text>
            <Feather name={iconName} size={16} color={iconColor} />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={headerStyles.username}>
              {dashboard?.user.fullName ?? "Student"}
            </Text>
            
            <View style={{ marginLeft: 8, marginTop: 4 }}>
              {isOffline ? (
                <Feather name="cloud-off" size={16} color={colors.warning} /> 
              ) : (
                <Feather name="check-circle" size={16} color={colors.success} /> 
              )}
            </View>
          </View>

          <Text style={headerStyles.subtitle}>
            Keep pushing forward. Every topic mastered takes you one step closer.
          </Text>

          <View style={statsStyles.statsContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
              <Feather name="zap" size={16} color={colors.warning} style={{ marginRight: 6 }} />
              <Text style={statsStyles.streakText}>
                {dashboard?.streak.days ?? 0} Days
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="star" size={16} color={colors.warning} style={{ marginRight: 6 }} />
              <Text style={statsStyles.levelText}>
                Lv. {dashboard?.xp.level ?? 1}
              </Text>
            </View>
          </View>
        </View>

        <View style={headerStyles.headerIcons}>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="search" size={24} color={colors.textPrimary} /> 
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={markAsRead}>
            <View>
              <Feather name="bell" size={24} color={colors.textPrimary} />
              {(dashboard?.notificationsCount ?? 0) > 0 && (
                <View style={statsStyles.notificationBadge}>
                  <Text style={statsStyles.badgeText}>
                    {dashboard?.notificationsCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default HomeHeader;