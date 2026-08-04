import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { 
  Flame, Bell, BookOpen, Clock, Target, 
  CheckCircle2, Circle, Coffee, CalendarCheck, Sparkles 
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Button } from '../../components/ui/Button';
import { useAchievementStore } from '@/store/useAchievementStore';
import { AchievementUnlockedModal } from '@/components/achievements/AchievementUnlockedModal';

export const DashboardScreen = () => {
  const { theme } = useTheme();
  const { data, isLoading, fetchDashboard } = useDashboardStore();
  const { markAsViewed, isMarkingViewed } = useAchievementStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading && !data) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <Text style={{ color: theme.colors.textSecondary }}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) return null;

  const xpPercentage = Math.min(100, Math.max(0, (data.xp.current / data.xp.required) * 100));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => fetchDashboard(false)} tintColor={theme.colors.primary} />
        }
      >

        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>Hello,</Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>{data.user.fullName}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Flame size={16} color={theme.colors.error} />
              <Text style={[styles.badgeText, { color: theme.colors.error }]}>{data.streak.days}</Text>
            </View>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}>
              <Bell size={20} color={theme.colors.text} />
              {data.notificationsCount > 0 && (
                <View style={[styles.notificationDot, { backgroundColor: theme.colors.error }]} />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(100)} style={styles.motivationContainer}>
          <Text style={[styles.motivationText, { color: theme.colors.textSecondary }]}>
            "{typeof data.motivation === 'string' ? data.motivation : data.motivation.text}"
          </Text>
          {typeof data.motivation === 'object' && data.motivation.author ? (
            <Text style={[styles.motivationAuthor, { color: theme.colors.textSecondary }]}>
              — {data.motivation.author}
            </Text>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Level {data.xp.level}</Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>{data.xp.totalXp} Total XP</Text>
            </View>
            <Target size={24} color={theme.colors.primary} />
          </View>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: theme.colors.border }]}>
              <View style={[styles.progressBarFill, { backgroundColor: theme.colors.primary, width: `${xpPercentage}%` }]} />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>{data.xp.current} XP</Text>
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>{data.xp.required} XP</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={styles.flex1}>
              <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary, marginBottom: 4 }]}>Learning Progress</Text>
              {data.continueLearning ? (
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{data.continueLearning.moduleName}</Text>
              ) : (
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Ready to begin?</Text>
              )}
            </View>
            {data.continueLearning ? (
              <BookOpen size={24} color={theme.colors.primary} />
            ) : (
              <Sparkles size={24} color={theme.colors.primary} />
            )}
          </View>
          
          {data.continueLearning ? (
             <Button title="Resume Module" onPress={() => {}} />
          ) : (
            <View style={styles.emptyStateContent}>
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                You haven't started any modules yet. Dive into the curriculum to earn your first XP!
              </Text>
              <Button title="Browse Modules" variant="secondary" onPress={() => {}} />
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Tasks</Text>
          
          {data.tasks.length > 0 ? (
            data.tasks.map((task) => (
              <TouchableOpacity key={task.id} style={[styles.taskItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {task.isCompleted ? (
                  <CheckCircle2 size={20} color={theme.colors.primary} />
                ) : (
                  <Circle size={20} color={theme.colors.textSecondary} />
                )}
                <Text style={[
                  styles.taskTitle, 
                  { color: task.isCompleted ? theme.colors.textSecondary : theme.colors.text },
                  task.isCompleted && styles.taskCompleted
                ]}>
                  {task.title}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.surface }]}>
                <Coffee size={24} color={theme.colors.textSecondary} />
              </View>
              <Text style={[styles.emptyCardTitle, { color: theme.colors.text }]}>All Caught Up!</Text>
              <Text style={[styles.emptyCardDesc, { color: theme.colors.textSecondary }]}>
                You have no tasks due today. Enjoy your free time or plan ahead for tomorrow.
              </Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Assessments</Text>
          
          {data.upcomingAssessment ? (
            <View style={[styles.card, { backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', marginBottom: 0 }]}>
              <View style={styles.cardHeader}>
                <View style={styles.flex1}>
                  <Text style={[styles.cardSubtitle, { color: theme.colors.error, marginBottom: 4 }]}>
                    Upcoming {data.upcomingAssessment.type}
                  </Text>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {data.upcomingAssessment.title}
                  </Text>
                  <Text style={[styles.dueDate, { color: theme.colors.textSecondary }]}>
                    Due: {new Date(data.upcomingAssessment.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <Clock size={24} color={theme.colors.error} />
              </View>
            </View>
          ) : (
            <View style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.surface }]}>
                <CalendarCheck size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.emptyCardTitle, { color: theme.colors.text }]}>No Upcoming Tests</Text>
              <Text style={[styles.emptyCardDesc, { color: theme.colors.textSecondary }]}>
                You have no pending assignments or quizzes. You are clear to focus on learning!
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {data?.achievement && (
        <AchievementUnlockedModal 
          achievement={data.achievement} 
          isLoading={isMarkingViewed}
          onDismiss={async () => {
            const success = await markAsViewed(data.achievement!.id);
            if (success) {
              fetchDashboard(true); 
            }
          }} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  flex1: { flex: 1 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 14, fontWeight: '500' },
  name: { fontSize: 24, fontWeight: '800', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, gap: 4 },
  badgeText: { fontSize: 14, fontWeight: '700' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: '#FFF' },
  
  motivationContainer: { marginBottom: 24, paddingHorizontal: 4 },
  motivationText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  motivationAuthor: { fontSize: 12, fontWeight: '600', marginTop: 6, textAlign: 'right' },

  card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  cardSubtitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  progressContainer: { marginTop: 8 },
  progressBarBg: { height: 8, borderRadius: 4, width: '100%', overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressTextContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 12, fontWeight: '600' },

  emptyStateContent: { marginTop: -4, marginBottom: 16 },
  emptyStateText: { fontSize: 14, lineHeight: 20, marginBottom: 16 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  taskItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 8, gap: 12 },
  taskTitle: { fontSize: 15, fontWeight: '500', flex: 1 },
  taskCompleted: { textDecorationLine: 'line-through' },

  emptyCard: { padding: 24, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  emptyIconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyCardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  emptyCardDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },

  dueDate: { fontSize: 13, marginTop: 8, fontWeight: '500' },
  bottomPadding: { height: 40 }
});