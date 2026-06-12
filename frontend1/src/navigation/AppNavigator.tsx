import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import StudentBottomTabs from "./StudentBottomTabs";

const Stack =
  createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="StudentTabs"
        component={
          StudentBottomTabs
        }
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;