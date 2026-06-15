import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";

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
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="AdminHome" component={AdminHomeScreen} />
      <Tab.Screen name="ManageUsers" component={ManageUsersScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;