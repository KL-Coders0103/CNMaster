import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, RefreshControl } from "react-native"; // 👈 Added RefreshControl
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import HomeHeader from "../../components/home/HomeHeader";
import ContinueLearningCard from "../../components/home/ContinueLearningCard";
import TasksCard from "../../components/home/TasksCard";
import MotivationCard from "../../components/home/MotivationCard";
import WeakAreasCard from "../../components/home/WeakAreasCard";
import AchievementPopup from "../../components/home/AchievementPopup";
import HomeSkeleton from "../../components/home/HomeSkeleton";
import UpcomingDeadlineCard from "../../components/home/UpcomingDeadlineCard";
import WeeklyHeatmapCard from "../../components/home/WeeklyHeatmapCard";
import FloatingActionButton from "../../components/common/FloatingActionButton";
import ThemeToggle from "../../components/common/ThemeToggle";

// Stores & Styles
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { getStudentHomeStyles } from "../../styles/screens/studentHomeStyles";

const StudentHomeScreen = () => {
  const [achievementVisible, setAchievementVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { dashboard, isLoading, fetchDashboard } = useDashboardStore();       
  const { colors } = useThemeStore(); 
  const styles = getStudentHomeStyles(colors); 

  const achievement = dashboard?.achievement;

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (dashboard?.achievement && !achievementVisible) {
      setAchievementVisible(true);
    }
  }, [dashboard?.achievement, achievementVisible]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDashboard();
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    } finally {
      setRefreshing(false); 
    }
  }, [fetchDashboard]);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <HomeSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary} 
            colors={[colors.primary]} 
            progressBackgroundColor={colors.surface} 
          />
        }
      >
        <HomeHeader />
        
        <View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
          <ThemeToggle />
        </View>

        <UpcomingDeadlineCard />
        <ContinueLearningCard />
        <TasksCard />
        <MotivationCard />
        <WeeklyHeatmapCard />
        <WeakAreasCard />
        
        <AchievementPopup 
          visible={achievementVisible && !!achievement}
          title={achievement?.title ?? ""}
          description={achievement?.description ?? ""}
          xp={achievement?.xp ?? 0}
          onClose={() => setAchievementVisible(false)}
        />
      </ScrollView>

      <FloatingActionButton />
    </SafeAreaView>
  );
};

export default StudentHomeScreen;