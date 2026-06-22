import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";

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

import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { useNotesStore } from "../../store/notesStore";
import UpcomingAssignmentCard from "../../components/home/UpcomingAssignmentCard";
import { useAssignmentStore } from "../../store/assignmentStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import DailyChallengeCard from "../../components/home/DailychallengeCard";

const StudentHomeScreen = () => {
  const [achievementVisible, setAchievementVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { dashboard, isLoading, fetchDashboard, markAchievementViewed } = useDashboardStore();
  const { fetchWeakAreas } = useAnalyticsStore();       
  const { colors } = useThemeStore(); 
  const styles = createStyles(colors); 

  const achievement = dashboard?.achievement;

  const fetchRecentNotes =
  useNotesStore(
    state => state.fetchRecentNotes
  );

  const { fetchUpcomingAssignment} = useAssignmentStore();

  useEffect(() => {
    fetchDashboard();
    fetchRecentNotes();
    fetchUpcomingAssignment();
    fetchWeakAreas();
  }, [fetchDashboard, fetchRecentNotes, fetchUpcomingAssignment, fetchWeakAreas]);

  useEffect(() => {
    if (dashboard?.achievement && !achievementVisible) {
      setAchievementVisible(true);
    }
  }, [dashboard?.achievement, achievementVisible]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchDashboard(),
        fetchRecentNotes(),
        fetchWeakAreas(),
      ]);
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
        <DailyChallengeCard />
        <UpcomingDeadlineCard />
        <UpcomingAssignmentCard />
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
          onClose={async () => {
            setAchievementVisible(false);
            if(achievement?.id) {
              await markAchievementViewed(achievement.id);
            }
          }}
        />
      </ScrollView>

      <FloatingActionButton />
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
});

export default StudentHomeScreen;