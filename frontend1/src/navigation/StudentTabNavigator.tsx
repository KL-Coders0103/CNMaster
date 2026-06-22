import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import StudentHomeScreen from "../screens/student/StudentHomeScreen";
import PlannerScreen from "../screens/student/PlannerScreen";

import { useThemeStore } from "../store/themeStore"; 
import ProfileStackNavigator from "./ProfileStackNavigator";
import NotesStackNavigator from "./NotesStackNavigator";
import AssignmentStackNavigator from "./AssignmentStackNavigator";
import QuizStackNavigator from "./QuizStackNavigator";

const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
  const { colors } = useThemeStore(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: colors.surface, 
          borderTopWidth: 0,
          shadowColor: colors.shadow, 
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.placeholder,
        tabBarIcon: ({ color, size }) => {
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
      <Tab.Screen name="Home" component={StudentHomeScreen} />
      <Tab.Screen name="Notes" component={NotesStackNavigator} />
      <Tab.Screen name="Assignments" component={AssignmentStackNavigator} />
      <Tab.Screen name="QuizHome" component={QuizStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;