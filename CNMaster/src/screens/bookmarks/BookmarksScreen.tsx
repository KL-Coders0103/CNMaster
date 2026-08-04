import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookmarkMinus, BookOpen, Target, CheckCircle2 } from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { useBookmarkStore } from '../../store/useBookmarkStore';

export const BookmarksScreen = () => {
  const { theme } = useTheme();
  
  const { bookmarks, isLoading, fetchBookmarks, toggleBookmark } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Saved Questions</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchBookmarks} tintColor={theme.colors.primary} />}
      >
        
        {bookmarks.length === 0 && !isLoading ? (
          <View style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
            <BookmarkMinus size={40} color={theme.colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No saved questions yet</Text>
            <Text style={[styles.emptyDesc, { color: theme.colors.textSecondary }]}>
              When reviewing your quiz results, tap the bookmark icon on tricky questions to save them here for quick revision.
            </Text>
          </View>
        ) : (
          bookmarks.map((bookmark, index) => (
            <Animated.View 
              key={bookmark.questionId} 
              entering={FadeInDown.delay(index * 100)}
              style={[styles.questionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: `${theme.colors.primary}15` }]}>
                  <Target size={14} color={theme.colors.primary} />
                  <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                    {bookmark.question.chapter.title}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.removeBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
                  onPress={() => toggleBookmark(bookmark.questionId)}
                >
                  <BookmarkMinus size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.questionText, { color: theme.colors.text }]}>
                {bookmark.question.question}
              </Text>

              <View style={[styles.answerBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <View style={styles.answerHeader}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <Text style={[styles.answerLabel, { color: '#10B981' }]}>Correct Answer</Text>
                </View>
                <Text style={[styles.answerText, { color: '#10B981' }]}>
                  {bookmark.question.correctAnswer}
                </Text>
              </View>

              {bookmark.question.explanation && (
                <View style={[styles.explanationBox, { borderTopColor: theme.colors.border }]}>
                  <View style={styles.explanationHeader}>
                    <BookOpen size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.explanationLabel, { color: theme.colors.textSecondary }]}>Why is this correct?</Text>
                  </View>
                  <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
                    {bookmark.question.explanation}
                  </Text>
                </View>
              )}
            </Animated.View>
          ))
        )}

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

  emptyCard: { padding: 40, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  emptyDesc: { fontSize: 15, textAlign: 'center', lineHeight: 24 },

  questionCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  removeBtn: { padding: 8, borderRadius: 8 },

  questionText: { fontSize: 17, fontWeight: '700', lineHeight: 26, marginBottom: 20 },

  answerBox: { padding: 16, borderRadius: 12, marginBottom: 16 },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  answerLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  answerText: { fontSize: 16, fontWeight: '700' },

  explanationBox: { paddingTop: 16, borderTopWidth: 1 },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  explanationLabel: { fontSize: 13, fontWeight: '700' },
  explanationText: { fontSize: 15, lineHeight: 22 },
});