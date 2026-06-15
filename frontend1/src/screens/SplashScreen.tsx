import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  Image,
  StyleSheet,
} from "react-native";

import { useAuthStore } from "../store/authStore"
import { initializeAuth } from "../services/authBootstrap";

const SplashScreen = () => {
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    initializeAuth();
    const timer = setTimeout(() => {
      console.log("Splash finished, ready for navigation.");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require("../../assets/icon.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>CN MASTER</Text>
      {isInitializing && (
        <ActivityIndicator 
          size="large" 
          color="#2563EB" 
          style={styles.loader} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 24,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: 2,
    marginBottom: 20,
  },
  loader: {
    position: "absolute",
    bottom: 80,
  },
});

export default SplashScreen;