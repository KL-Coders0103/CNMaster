import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";

import AssignmentAnalyticsCard from "../../components/profile/AssignmentAnalyticsCard";
import WeeklyAnalyticsCard from "../../components/profile/WeeklyAnalyticsCard";
import LearningAnalyticsCard from "../../components/profile/LearningAnalyticsCard";
import ConsistencyHeatmapCard from "../../components/profile/ConsistencyHeatmapCard";
import RecentActivityTimeline from "../../components/profile/RecentActivityTimeline";

const AnalyticsScreen = ({ navigation }: any) => {
  const { colors } = useThemeStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.surface }]}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Analytics & Progress
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <ConsistencyHeatmapCard />
        <WeeklyAnalyticsCard />
        <LearningAnalyticsCard />
        <AssignmentAnalyticsCard />
        <RecentActivityTimeline />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
});

export default AnalyticsScreen;