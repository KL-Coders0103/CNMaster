import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Search, CheckCircle2, Clock, BarChart3, AlertCircle, ChevronRight, FileText, Target } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../theme/ThemeProvider';
import { useAssignmentsStore } from '../../store/useAssignmentStore';

export const AssignmentsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  const { 
    assignments, availableChapters, analytics, upcomingAssignment, isLoading, 
    searchQuery, setSearchQuery, selectedChapterId, setSelectedChapterId, 
    initializeDashboard, fetchAssignments
  } = useAssignmentsStore();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return theme.colors.primary; 
      case 'GRADED': return '#10B981'; 
      case 'OVERDUE': return theme.colors.error;
      default: return '#F59E0B'; 
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'In Review';
      case 'GRADED': return 'Graded';
      case 'OVERDUE': return 'Overdue';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Assignments</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={initializeDashboard} tintColor={theme.colors.primary} />
        }
      >
        {analytics && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.analyticsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={[styles.statIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <CheckCircle2 size={20} color="#10B981" />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{analytics.completed}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Completed</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={[styles.statIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Clock size={20} color="#F59E0B" />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{analytics.pending}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Pending</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={[styles.statIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <BarChart3 size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{analytics.averageMarks}%</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Avg. Score</Text>
            </View>
          </Animated.View>
        )}

        {upcomingAssignment && !searchQuery && selectedChapterId === null && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Next Due</Text>
            <TouchableOpacity 
              style={[styles.upcomingCard, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('AssignmentDetails', { assignmentId: upcomingAssignment.id })}
            >
              <View style={styles.upcomingContent}>
                <View style={styles.upcomingBadge}>
                  <AlertCircle size={14} color={theme.colors.primary} />
                  <Text style={[styles.upcomingBadgeText, { color: theme.colors.primary }]}>Due Soon</Text>
                </View>
                <Text style={styles.upcomingTitle} numberOfLines={1}>{upcomingAssignment.title}</Text>
                <Text style={styles.upcomingDate}>Due {formatDate(upcomingAssignment.dueDate)}</Text>
              </View>
              <View style={styles.upcomingAction}>
                <ChevronRight size={24} color="#FFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search assignments..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => fetchAssignments()}
              returnKeyType="search"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chaptersStrip}>
            <TouchableOpacity 
              style={[
                styles.chapterPill, 
                { backgroundColor: selectedChapterId === null ? theme.colors.primary : theme.colors.surface,
                  borderColor: selectedChapterId === null ? theme.colors.primary : theme.colors.border }
              ]}
              onPress={() => setSelectedChapterId(null)}
            >
              <Text style={[styles.chapterPillText, { color: selectedChapterId === null ? '#FFF' : theme.colors.text }]}>All</Text>
            </TouchableOpacity>

            {availableChapters.map((chapter) => (
              <TouchableOpacity 
                key={chapter.id}
                style={[
                  styles.chapterPill, 
                  { backgroundColor: selectedChapterId === chapter.id ? theme.colors.primary : theme.colors.surface,
                    borderColor: selectedChapterId === chapter.id ? theme.colors.primary : theme.colors.border }
                ]}
                onPress={() => setSelectedChapterId(chapter.id)}
              >
                <Text style={[styles.chapterPillText, { color: selectedChapterId === chapter.id ? '#FFF' : theme.colors.text }]}>
                  {chapter.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>All Tasks</Text>
          
          {assignments.length === 0 && !isLoading ? (
            <View style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
              <Target size={32} color={theme.colors.textSecondary} style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyCardTitle, { color: theme.colors.text }]}>You're all caught up!</Text>
              <Text style={[styles.emptyCardDesc, { color: theme.colors.textSecondary }]}>No assignments match your search.</Text>
            </View>
          ) : (
            assignments.map((assignment) => (
              <TouchableOpacity 
                key={assignment.id} 
                style={[styles.assignmentCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => navigation.navigate('AssignmentDetails', { assignmentId: assignment.id })}
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(150,150,150,0.1)' }]}>
                  <FileText size={22} color={theme.colors.text} />
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={[styles.cardChapter, { color: theme.colors.textSecondary }]}>{assignment.chapter.title}</Text>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>{assignment.title}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={[styles.cardDate, { color: theme.colors.textSecondary }]}>Due: {formatDate(assignment.dueDate)}</Text>
                    <View style={styles.dot} />
                    <Text style={[styles.cardMarks, { color: theme.colors.textSecondary }]}>{assignment.maxMarks} Marks</Text>
                  </View>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(assignment.submissionStatus)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(assignment.submissionStatus) }]}>
                    {getStatusText(assignment.submissionStatus)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 16, borderBottomWidth: 1, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  scrollContent: { padding: 20 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },

  analyticsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  statIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '500' },

  upcomingCard: { flexDirection: 'row', borderRadius: 16, padding: 20, alignItems: 'center' },
  upcomingContent: { flex: 1 },
  upcomingBadge: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  upcomingBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  upcomingTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  upcomingDate: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
  upcomingAction: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 50, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '500' },

  chaptersStrip: { gap: 8, paddingBottom: 4 },
  chapterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chapterPillText: { fontSize: 13, fontWeight: '600' },

  assignmentCard: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12, alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardContent: { flex: 1, marginRight: 12 },
  cardChapter: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  cardDate: { fontSize: 12, fontWeight: '500' },
  cardMarks: { fontSize: 12, fontWeight: '500' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#9CA3AF', marginHorizontal: 8 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  emptyCard: { padding: 32, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  emptyCardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyCardDesc: { fontSize: 14, textAlign: 'center' },
});