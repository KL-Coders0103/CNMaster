import React, {
  useEffect,
} from "react";

import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";

import {
  initializeAuth,
} from "../services/authBootstrap";

import {
  useAuthStore,
} from "../store/authStore";

const SplashScreen = () => {
  const isInitializing =
    useAuthStore(
      (state) =>
        state.isInitializing
    );

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent:
          "center",
        alignItems:
          "center",
        backgroundColor:
          "#FFFFFF",
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight:
            "bold",
          marginBottom:
            20,
        }}
      >
        CN MASTER
      </Text>

      {isInitializing && (
        <ActivityIndicator
          size="large"
        />
      )}
    </View>
  );
};

export default SplashScreen;