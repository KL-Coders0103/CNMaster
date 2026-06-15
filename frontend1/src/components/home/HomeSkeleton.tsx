import React from "react";

import {
  View,
} from "react-native";

import {
  homeSkeletonStyles,
} from "../../styles/components/home/homeSkeletonStyles";

const SkeletonBlock = ({
  height,
}: {
  height: number;
}) => (
  <View
    style={[
      homeSkeletonStyles.skeletonBlock,
      {
        height,
      },
    ]}
  />
);

const HomeSkeleton = () => {
  return (
    <View
      style={
        homeSkeletonStyles.container
      }
    >
      <SkeletonBlock height={90} />

      <SkeletonBlock height={150} />

      <SkeletonBlock height={120} />

      <SkeletonBlock height={120} />

      <SkeletonBlock height={90} />
    </View>
  );
};

export default HomeSkeleton;