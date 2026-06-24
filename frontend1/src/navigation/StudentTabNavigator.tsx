import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // CRITICAL: Import Stack
import { Feather } from "@expo/vector-icons";

import StudentHomeScreen from "../screens/student/StudentHomeScreen";
import PlannerScreen from "../screens/student/PlannerScreen"; // CRITICAL: Import Planner

import { useThemeStore } from "../store/themeStore"; 
import ProfileStackNavigator from "./ProfileStackNavigator";
import NotesStackNavigator from "./NotesStackNavigator";
import AssignmentStackNavigator from "./AssignmentStackNavigator";
import QuizStackNavigator from "./QuizStackNavigator";
import NotificationsScreen from "../screens/student/NotificationsScreen";
import SearchScreen from "../screens/student/SearchScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();


const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="StudentHome" component={StudentHomeScreen} />
    <HomeStack.Screen name="Planner" component={PlannerScreen} />
    <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
    <HomeStack.Screen name="Search" component={SearchScreen} />
  </HomeStack.Navigator>
);

const StudentTabNavigator = () => {
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

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Notes") iconName = "book-open";
          else if (route.name === "Assignments") iconName = "clipboard";
          else if (route.name === "QuizHome") iconName = "help-circle";
          else if (route.name === "Profile") iconName = "user";

          return <Feather name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      
      <Tab.Screen name="Notes" component={NotesStackNavigator} />
      <Tab.Screen name="Assignments" component={AssignmentStackNavigator} />
      <Tab.Screen name="QuizHome" component={QuizStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;