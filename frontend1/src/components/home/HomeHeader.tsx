import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  homeHeaderStyles,
} from "../../styles/components/home/homeHeaderStyles";
import { useDashboardStore } from "../../store/dashboardStore";
import { homeStatsStyles } from "./homeStatsStyles";

const HomeHeader = () => {
  const dashboard = useDashboardStore(state => state.dashboard);

  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 17
      ? "Good Afternoon 🌤️"
      : "Good Evening 🌙";

  return (
    <View
      style={
        homeHeaderStyles.headerContainer
      }
    >
      <View
        style={{ flex: 1 }}
      >
        <Text
          style={
            homeHeaderStyles.greeting
          }
        >
          {greeting}
        </Text>

        <Text
          style={
            homeHeaderStyles.username
          }
        >
          Welcome back,
          {"\n"}
          {dashboard?.user.fullName ??
            "Student"}
        </Text>

        <Text
          style={
            homeHeaderStyles.subtitle
          }
        >
          Keep pushing forward.
          Every topic mastered
          takes you one step
          closer.
        </Text>

        <View
           style={
             homeStatsStyles.statsContainer
              }
            >
          <Text
            style={
              homeStatsStyles.streakText
            }
          >
            🔥 {dashboard?.streak.days ?? 0} Days
          </Text>

          <Text
            style={
              homeStatsStyles.levelText
            }
          >
            ⭐ Lv.
            {dashboard?.xp.level ?? 1}
          </Text>
        </View>
      </View>

      <View
        style={
          homeHeaderStyles.headerIcons
        }
      >
        <TouchableOpacity>
          <Ionicons
            name="search"
            size={24}
            color="#1F2937"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginLeft: 20,
          }}
        >
          <View>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#1F2937"
            />

            {(dashboard?.notificationsCount ?? 0) > 0 && (
              <View
                style={
                  homeStatsStyles.notificationBadge
                }
              >
                <Text
                  style={
                    homeStatsStyles.badgeText
                  }
                >
                  {dashboard?.notificationsCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;