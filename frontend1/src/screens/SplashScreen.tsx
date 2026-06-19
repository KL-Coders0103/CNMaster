import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { useAuthStore } from "../store/authStore";
import { initializeAuth } from "../services/authBootstrap";

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    initializeAuth();
    
    // Smooth entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <Image 
        source={require("../../assets/icon.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>CN MASTER</Text>
      
      {/* Subtle loader for when backend logic takes extra time */}
      {isInitializing && (
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>Syncing your progress...</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Premium solid white
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1E293B",
    letterSpacing: 1,
  },
  loaderContainer: {
    position: "absolute",
    bottom: 60,
  },
  loaderText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default SplashScreen;