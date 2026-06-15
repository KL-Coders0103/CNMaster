import React, { useEffect, useState } from "react";

import {
  ScrollView,
  TouchableOpacity,
  Text
} from "react-native";

import HomeHeader from "../../components/home/HomeHeader";

import ContinueLearningCard from "../../components/home/ContinueLearningCard";

import {
  studentHomeStyles,
} from "../../styles/screens/studentHomeStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import TasksCard from "../../components/home/TasksCard";
import MotivationCard from "../../components/home/MotivationCard";
import WeakAreasCard from "../../components/home/WeakAreasCard";
import AchievementPopup from "../../components/home/AchievementPopup";
import { useDashboardStore } from "../../store/dashboardStore";
import HomeSkeleton from "../../components/home/HomeSkeleton";

const StudentHomeScreen =
  () => {

    const [achievementVisible, setAchievementVisisble] = useState(false);

    const {dashboard, isLoading, fetchDashboard} = useDashboardStore();       

    const achievement = dashboard?.achievement;

    useEffect(() => {
      fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
      if (
        dashboard?.achievement &&
        !achievementVisible
      ) {
        setAchievementVisisble(true);
      }
    }, [
      dashboard?.achievement,
      achievementVisible,
    ]);

    if (isLoading) {
      return (
        <SafeAreaView
          style={studentHomeStyles.container}
        >
          <HomeSkeleton />
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView
        style={
          studentHomeStyles.container
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
        >
          <HomeHeader />
          <ContinueLearningCard />
          <TasksCard />
          <MotivationCard />
          <WeakAreasCard />
          <AchievementPopup 
            visible={achievementVisible && !!achievement}
            title={achievement?.title ?? ""}
            description={achievement?.description ?? ""}
            xp={achievement?.xp ?? 0}
            onClose={() => setAchievementVisisble(false)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  };

export default StudentHomeScreen;