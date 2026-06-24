import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { useAuthStore } from "../store/authStore";
import { initializeAuth } from "../services/authBootstrap";
import { useThemeStore } from "../store/themeStore"; // CRITICAL FIX: Bring in the theme store

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const { colors } = useThemeStore(); // Extract your dynamic colors

  useEffect(() => {
    initializeAuth();
    
    // Smooth entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background, // Dynamic background
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }] 
        }
      ]}
    >
      <Image 
        source={require("../../assets/icon.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Dynamic text color */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>CN MASTER</Text>
      
      {/* Subtle loader for when backend logic takes extra time */}
      {isInitializing && (
        <View style={styles.loaderContainer}>
          <Text style={[styles.loaderText, { color: colors.textSecondary }]}>
            Syncing your progress...
          </Text>
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
    // Background color removed from here to allow inline dynamic styling
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
  },
  loaderContainer: {
    position: "absolute",
    bottom: 60,
  },
  loaderText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default SplashScreen;