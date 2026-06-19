import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SplashScreen from "../screens/SplashScreen";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { useAuthStore } from "../store/authStore";

const RootNavigator = () => {
  const { isAuthenticated, isInitializing, user } = useAuthStore();

  // If initializing, show ONLY the Splash Screen.
  // Nothing else (NavigationContainer, Providers) should be here.
  if (isInitializing) {
    return <SplashScreen />;
  }

  // If initialization is done, show the navigation logic.
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          user?.isProfileCompleted ? <AppNavigator /> : <AuthNavigator initialRouteName="CompleteProfile" />
        ) : (
          <AuthNavigator initialRouteName="Register" />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootNavigator;