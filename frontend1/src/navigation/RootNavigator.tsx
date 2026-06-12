import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import SplashScreen from "../screens/SplashScreen";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

import {
  useAuthStore,
} from "../store/authStore";

const RootNavigator = () => {
  const {
    isAuthenticated,
    isInitializing,
    user,
  } = useAuthStore();

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        user?.isProfileCompleted ? (
          <AppNavigator />
        ) : (
          <AuthNavigator
            initialRouteName="CompleteProfile"
          />
        )
      ) : (
        <AuthNavigator
          initialRouteName="Register"
        />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;