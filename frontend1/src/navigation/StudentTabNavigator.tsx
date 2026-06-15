import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import NotesScreen from "../screens/student/NotesScreen";
import AssignmentsScreen from "../screens/student/AssignmentScreen";
import PlannerScreen from "../screens/student/PlannerScreen";
import ProfileScreen from "../screens/student/ProfileScreen";
import StudentHomeScreen from "../screens/student/StudentHomeScreen";

const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={StudentHomeScreen}
      />

      <Tab.Screen
        name="Notes"
        component={NotesScreen}
      />

      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
      />

      <Tab.Screen
        name="Planner"
        component={PlannerScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;