import React from "react";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/student/HomeScreen";
import NotesScreen from "../screens/student/NotesScreen";
import AssignmentsScreen from "../screens/student/AssignmentScreen";
import PlannerScreen from "../screens/student/PlannerScreen";
import ProfileScreen from "../screens/student/ProfileScreen";

export type StudentTabParamList = {
  Home: undefined;
  Notes: undefined;
  Assignments: undefined;
  Planner: undefined;
  Profile: undefined;
};

const Tab =
  createBottomTabNavigator<StudentTabParamList>();

const StudentBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
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

export default StudentBottomTabs;