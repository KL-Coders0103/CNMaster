import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import ProfileScreen from "../screens/student/ProfileScreen";
import EditProfileScreen from "../screens/student/EditProfileScreen";
import AchievementScreen from "../screens/student/AchievementScreen";
import ActivityHistoryScreen from "../screens/student/ActivityHistoryScreen";
import LeaderboardScreen from "../screens/student/LeaderboardScreen";
import SettingsScreen from "../screens/student/SettingsScreen";
import ChangePasswordScreen from "../screens/student/ChangePasswordScreen";
import DeleteAccountScreen from "../screens/student/DeleteAccountScreen";

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Achievements: undefined;
  ActivityHistory: undefined;
  Leaderboard: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
};

const Stack =
  createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator =
  () => {

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="ProfileHome"
          component={ProfileScreen}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
        />

        <Stack.Screen
          name="Achievements"
          component={AchievementScreen}
        />

        <Stack.Screen
          name="ActivityHistory"
          component={ActivityHistoryScreen}
        />

        <Stack.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />

        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
        />

        <Stack.Screen 
          name="DeleteAccount" 
          component={DeleteAccountScreen} 
          options={{ title: 'Delete Account' }} 
        />
      </Stack.Navigator>
    );
  };

export default ProfileStackNavigator;