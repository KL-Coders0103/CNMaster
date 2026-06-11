import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import {
  View,
  Text,
} from "react-native";

const Stack =
  createNativeStackNavigator();

const Dashboard =
  () => (
    <View
      style={{
        flex: 1,
        justifyContent:
          "center",
        alignItems:
          "center",
      }}
    >
      <Text>
        Dashboard
      </Text>
    </View>
  );

const AppNavigator =
  () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={
            Dashboard
          }
        />
      </Stack.Navigator>
    );
  };

export default AppNavigator;