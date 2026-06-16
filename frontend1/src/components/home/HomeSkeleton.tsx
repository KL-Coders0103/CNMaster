import React from "react";
import { View } from "react-native";
import { getHomeSkeletonStyles } from "../../styles/components/home/homeSkeletonStyles";
import { useThemeStore } from "../../store/themeStore";

type SkeletonBlockProps = {
  height: number;
  style: object;
};

const SkeletonBlock = ({ height, style }: SkeletonBlockProps) => (
  <View style={[style, { height }]} />
);

const HomeSkeleton = () => {
  const { colors } = useThemeStore();
  const styles = getHomeSkeletonStyles(colors);

  return (
    <View style={styles.container}>
      <SkeletonBlock height={90} style={styles.skeletonBlock} />
      <SkeletonBlock height={150} style={styles.skeletonBlock} />
      <SkeletonBlock height={120} style={styles.skeletonBlock} />
      <SkeletonBlock height={120} style={styles.skeletonBlock} />
      <SkeletonBlock height={90} style={styles.skeletonBlock} />
    </View>
  );
};

export default HomeSkeleton;