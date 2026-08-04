import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Flame, Clock, BookOpen, FileCheck, Target, TrendingUp, AlertTriangle, Zap, Activity } from 'lucide-react-native';
import { BarChart } from 'react-native-chart-kit';

import { useTheme } from '../../theme/ThemeProvider';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const screenWidth = Dimensions.get('window').width;

export const AnalyticsScreen = () => {
  const { theme } = useTheme();
  
  const { 
    weeklyAnalytics, learningAnalytics, heatmap, recentActivities, weakAreas,
    isLoading, fetchDashboardData 
  } = useAnalyticsStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    fetchDashboardData();
  }, []);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 4: return theme.colors.primary;
      case 3: return `${theme.colors.primary}CC`; 
      case 2: return `${theme.colors.primary}80`; 
      case 1: return `${theme.colors.primary}40`; 
      default: return theme.colors.surface;       
    }
  };

  if (isLoading && !weeklyAnalytics) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Crunching your data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Performance</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >

        {weeklyAnalytics && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Flame size={20} color="#F59E0B" style={styles.statIcon} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{weeklyAnalytics.xpEarned}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>XP Earned</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Clock size={20} color={theme.colors.primary} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{weeklyAnalytics.studyHours}h</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Study Time</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <BookOpen size={20} color="#10B981" style={styles.statIcon} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{weeklyAnalytics.notesRead}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Notes Read</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <FileCheck size={20} color="#8B5CF6" style={styles.statIcon} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{weeklyAnalytics.assignmentsSubmitted}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Submissions</Text>
            </View>
          </Animated.View>
        )}

        {heatmap.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>30-Day Activity</Text>
            <View style={[styles.heatmapCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.heatmapGrid}>
                {heatmap.map((day, index) => (
                  <View 
                    key={index} 
                    style={[styles.heatBox, { 
                      backgroundColor: getIntensityColor(day.intensity),
                      borderColor: day.intensity === 0 ? theme.colors.border : 'transparent'
                    }]} 
                  />
                ))}
              </View>
              <View style={styles.heatmapLegend}>
                <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Less</Text>
                {[0, 1, 2, 3, 4].map(level => (
                  <View key={level} style={[styles.legendBox, { 
                    backgroundColor: getIntensityColor(level),
                    borderColor: level === 0 ? theme.colors.border : 'transparent'
                  }]} />
                ))}
                <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>More</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {weeklyAnalytics && (
          <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Weekly Trend</Text>
            <View style={[styles.chartCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <BarChart
                data={{
                  labels: ["S", "M", "T", "W", "T", "F", "S"],
                  datasets: [{ data: weeklyAnalytics.weeklyTrend }]
                }}
                width={screenWidth - 72} 
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                withInnerLines={false}
                showValuesOnTopOfBars
                fromZero
                chartConfig={{
                  backgroundColor: theme.colors.surface,
                  backgroundGradientFrom: theme.colors.surface,
                  backgroundGradientTo: theme.colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => theme.colors.primary,
                  labelColor: (opacity = 1) => theme.colors.textSecondary,
                  barPercentage: 0.6,
                  fillShadowGradientFrom: theme.colors.primary,
                  fillShadowGradientFromOpacity: 1,
                  fillShadowGradientTo: theme.colors.primary,
                  fillShadowGradientToOpacity: 0.8,
                }}
                style={{ borderRadius: 12, paddingRight: 0 }}
              />
            </View>
          </Animated.View>
        )}

        {learningAnalytics && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Insights</Text>
            
            <View style={[styles.insightCard, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
              <TrendingUp size={24} color="#10B981" />
              <View style={styles.insightContent}>
                <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>Strongest Subject</Text>
                <Text style={[styles.insightValue, { color: theme.colors.text }]} numberOfLines={1}>
                  {learningAnalytics.strongestChapter}
                </Text>
              </View>
            </View>

            <View style={[styles.insightCard, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
              <AlertTriangle size={24} color="#EF4444" />
              <View style={styles.insightContent}>
                <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>Needs Review</Text>
                <Text style={[styles.insightValue, { color: theme.colors.text }]} numberOfLines={1}>
                  {learningAnalytics.weakestChapter}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(250)} style={styles.splitSection}>
          {weakAreas.length > 0 && (
            <View style={styles.halfSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Focus Areas</Text>
              <View style={[styles.listCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {weakAreas.map((area, idx) => (
                  <View key={area.id} style={[styles.listItem, idx !== weakAreas.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}>
                    <Target size={16} color={theme.colors.error} />
                    <Text style={[styles.listText, { color: theme.colors.text }]} numberOfLines={1}>{area.chapter.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {recentActivities.length > 0 && (
            <View style={styles.halfSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Log</Text>
              <View style={[styles.listCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {recentActivities.slice(0, 5).map((activity, idx) => (
                  <View key={activity.id} style={[styles.listItem, idx !== Math.min(4, recentActivities.length - 1) && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}>
                    <Activity size={16} color={theme.colors.primary} />
                    <Text style={[styles.listText, { color: theme.colors.text }]} numberOfLines={1}>{activity.action}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 14, fontWeight: '500' },
  
  header: { paddingVertical: 16, borderBottomWidth: 1, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  scrollContent: { padding: 20 },
  
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCard: { width: '48%', padding: 16, borderRadius: 16, borderWidth: 1 },
  statIcon: { marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600' },

  heatmapCard: { padding: 16, borderRadius: 16, borderWidth: 1 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  heatBox: { width: Math.floor((screenWidth - 100) / 10), aspectRatio: 1, borderRadius: 6, borderWidth: 1 },
  heatmapLegend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 16, gap: 6 },
  legendBox: { width: 12, height: 12, borderRadius: 3, borderWidth: 1 },
  legendText: { fontSize: 12, fontWeight: '500' },

  chartCard: { padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', overflow: 'hidden' },

  insightCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  insightContent: { marginLeft: 16, flex: 1 },
  insightLabel: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  insightValue: { fontSize: 16, fontWeight: '700' },

  splitSection: { flexDirection: 'column', gap: 24 }, 
  halfSection: { flex: 1 },
  listCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  listText: { flex: 1, fontSize: 14, fontWeight: '500' },
});