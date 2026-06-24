import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../store/themeStore";

// Replace these with your actual Admin screens when ready
const AdminHomeScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Admin Home</Text></View>
);
const ManageUsersScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Manage Users</Text></View>
);
const AnalyticsScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Analytics</Text></View>
);

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  const { colors, isDarkMode } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof Feather.glyphMap = "home";

          if (route.name === "AdminHome") iconName = "shield";
          else if (route.name === "ManageUsers") iconName = "users";
          else if (route.name === "Analytics") iconName = "pie-chart";

          return <Feather name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: "Admin" }} />
      <Tab.Screen name="ManageUsers" component={ManageUsersScreen} options={{ title: "Users" }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: "Analytics" }} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;