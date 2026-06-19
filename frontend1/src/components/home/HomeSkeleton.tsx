import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const HomeSkeleton = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  // Smooth breathing animation for the skeleton
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  // Helper to render animated blocks
  const AnimatedBlock = ({ style }: { style: object }) => (
    <Animated.View style={[style, { opacity: fadeAnim, backgroundColor: colors.border }]} />
  );

  return (
    <View style={styles.container}>
      {/* Top Nav Skeleton */}
      <View style={styles.headerRow}>
        <View>
          <AnimatedBlock style={styles.greeting} />
          <AnimatedBlock style={styles.username} />
        </View>
        <View style={styles.iconsRow}>
          <AnimatedBlock style={styles.iconCircle} />
          <AnimatedBlock style={styles.iconCircle} />
        </View>
      </View>

      {/* Stats Banner Skeleton */}
      <AnimatedBlock style={styles.statsBanner} />

      {/* Theme Toggle Skeleton */}
      <AnimatedBlock style={styles.themeToggle} />

      {/* Deadline Card Skeleton */}
      <AnimatedBlock style={styles.deadlineCard} />

      {/* Continue Learning Skeleton */}
      <View style={styles.continueLearningContainer}>
        <AnimatedBlock style={styles.sectionTitle} />
        <AnimatedBlock style={styles.continueLearningCard} />
      </View>

      {/* Tasks Skeleton */}
      <View style={styles.tasksContainer}>
        <AnimatedBlock style={styles.sectionTitle} />
        <AnimatedBlock style={styles.taskCard} />
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greeting: {
    width: 120,
    height: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  username: {
    width: 180,
    height: 28,
    borderRadius: 14,
  },
  iconsRow: {
    flexDirection: "row",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  statsBanner: {
    width: "100%",
    height: 120,
    borderRadius: 20,
    marginBottom: 24,
  },
  themeToggle: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    marginBottom: 24,
  },
  deadlineCard: {
    width: "100%",
    height: 160,
    borderRadius: 20,
    marginBottom: 24,
  },
  continueLearningContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    width: 140,
    height: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  continueLearningCard: {
    width: "100%",
    height: 90,
    borderRadius: 20,
  },
  tasksContainer: {
    marginBottom: 24,
  },
  taskCard: {
    width: "100%",
    height: 180,
    borderRadius: 20,
  },
});

export default HomeSkeleton;