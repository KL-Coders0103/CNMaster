import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import AssignmentsScreen
  from "../screens/student/AssignmentScreen";

import AssignmentDetailScreen
  from "../screens/student/AssignmentDetailsScreen";
import SubmissionHistoryScreen from "../screens/student/SubmissionHistoryScreen";

export type AssignmentStackParamList = {

  AssignmentHome: undefined;

  AssignmentDetail: {
    assignmentId: string;
  };

  SubmissionHistory: undefined;
};

const Stack =
  createNativeStackNavigator<AssignmentStackParamList>();

const AssignmentStackNavigator =
  () => {

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen
          name="AssignmentHome"
          component={
            AssignmentsScreen
          }
        />

        <Stack.Screen
          name="AssignmentDetail"
          component={
            AssignmentDetailScreen
          }
        />

        <Stack.Screen
          name="SubmissionHistory"
          component={
            SubmissionHistoryScreen
          }
        />

      </Stack.Navigator>
    );
  };

export default AssignmentStackNavigator;