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
  } = useAuthStore();

  return (
    <NavigationContainer>
      {isInitializing ? (
        <SplashScreen />
      ) : isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;