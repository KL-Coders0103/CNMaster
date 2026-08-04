import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { CheckCircle2, XCircle, Award, Zap, ChevronRight, BookOpen, Bookmark } from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { useQuizStore } from '../../store/useQuizStore';
import { useBookmarkStore } from '../../store/useBookmarkStore'; 

export const QuizResultScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  const { attemptId } = route.params as { attemptId: string };
  const { currentResult, isLoading, fetchResult, clearActiveQuiz } = useQuizStore();

  const { bookmarks, toggleBookmark } = useBookmarkStore();

  useEffect(() => {
    fetchResult(attemptId);
  }, [attemptId]);

  const handleFinish = () => {
    clearActiveQuiz();
    navigation.navigate('Home'); 
  };

  if (isLoading || !currentResult) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Calculating results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const percentage = Math.round((currentResult.correctAnswers! / currentResult.totalQuestions) * 100);
  const isPassing = percentage >= 70;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Animated.View entering={ZoomIn.duration(500)} style={[styles.heroCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {currentResult.gamification?.isPerfectScore && (
            <View style={[styles.perfectBadge, { backgroundColor: '#F59E0B' }]}>
              <Award size={16} color="#FFF" />
              <Text style={styles.perfectBadgeText}>PERFECT SCORE</Text>
            </View>
          )}

          <View style={styles.scoreCircleContainer}>
            <View style={[
              styles.scoreCircle, 
              { borderColor: isPassing ? '#10B981' : theme.colors.error, backgroundColor: isPassing ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
            ]}>
              <Text style={[styles.scorePercentage, { color: isPassing ? '#10B981' : theme.colors.error }]}>
                {percentage}%
              </Text>
              <Text style={[styles.scoreFraction, { color: theme.colors.textSecondary }]}>
                {currentResult.correctAnswers} / {currentResult.totalQuestions}
              </Text>
            </View>
          </View>

          {currentResult.gamification && (
            <View style={[styles.xpContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Zap size={20} color="#F59E0B" fill="#F59E0B" />
              <Text style={[styles.xpText, { color: '#F59E0B' }]}>+{currentResult.gamification.xpEarned} XP Earned</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Answer Review</Text>

          {currentResult.quizAnswers.map((answer, index) => {
            const isCorrect = answer.isCorrect;

            const isBookmarked = bookmarks.some(b => b.questionId === answer.questionId);

            return (
              <View 
                key={answer.id} 
                style={[
                  styles.reviewCard, 
                  { backgroundColor: theme.colors.surface, borderColor: isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)' }
                ]}
              >
                <View style={styles.questionHeader}>
                  <Text style={[styles.questionNumber, { color: theme.colors.textSecondary }]}>Q{index + 1}</Text>
                  
                  <View style={styles.headerActions}>
                    <TouchableOpacity 
                      style={styles.bookmarkBtn} 
                      onPress={() => toggleBookmark(answer.questionId)}
                    >
                      <Bookmark 
                        size={22} 
                        color={isBookmarked ? theme.colors.primary : theme.colors.textSecondary} 
                        fill={isBookmarked ? theme.colors.primary : 'transparent'} 
                      />
                    </TouchableOpacity>

                    {isCorrect ? (
                      <CheckCircle2 size={24} color="#10B981" />
                    ) : (
                      <XCircle size={24} color={theme.colors.error} />
                    )}
                  </View>
                </View>
                
                <Text style={[styles.questionText, { color: theme.colors.text }]}>{answer.question.question}</Text>

                <View style={styles.answerBox}>
                  <Text style={[styles.answerLabel, { color: theme.colors.textSecondary }]}>Your Answer:</Text>
                  <Text style={[
                    styles.answerText, 
                    { color: isCorrect ? '#10B981' : theme.colors.error, fontWeight: '700' }
                  ]}>
                    {answer.selectedAnswer}
                  </Text>
                </View>

                {!isCorrect && (
                  <View style={[styles.correctAnswerBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <Text style={[styles.answerLabel, { color: '#10B981' }]}>Correct Answer:</Text>
                    <Text style={[styles.answerText, { color: '#10B981', fontWeight: '700' }]}>
                      {answer.question.correctAnswer}
                    </Text>
                  </View>
                )}

                {answer.question.explanation && (
                  <View style={styles.explanationBox}>
                    <View style={styles.explanationHeader}>
                      <BookOpen size={14} color={theme.colors.textSecondary} />
                      <Text style={[styles.explanationLabel, { color: theme.colors.textSecondary }]}>Explanation</Text>
                    </View>
                    <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
                      {answer.question.explanation}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </Animated.View>
        
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
        <TouchableOpacity 
          style={[styles.finishBtn, { backgroundColor: theme.colors.primary }]}
          onPress={handleFinish}
        >
          <Text style={styles.finishBtnText}>Continue</Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 14, fontWeight: '500' },
  scrollContent: { padding: 20 },

  heroCard: { padding: 24, borderRadius: 24, borderWidth: 1, alignItems: 'center', marginBottom: 32 },
  perfectBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, position: 'absolute', top: -14 },
  perfectBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  
  scoreCircleContainer: { marginVertical: 16 },
  scoreCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 8, justifyContent: 'center', alignItems: 'center' },
  scorePercentage: { fontSize: 36, fontWeight: '800' },
  scoreFraction: { fontSize: 14, fontWeight: '600', marginTop: 4 },

  xpContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, marginTop: 8 },
  xpText: { fontSize: 16, fontWeight: '800' },

  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },

  reviewCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  questionNumber: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },

  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookmarkBtn: { padding: 4 },
  
  questionText: { fontSize: 16, fontWeight: '600', lineHeight: 24, marginBottom: 16 },
  
  answerBox: { marginBottom: 8 },
  answerLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  answerText: { fontSize: 15 },
  
  correctAnswerBox: { padding: 12, borderRadius: 8, marginTop: 8 },
  
  explanationBox: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(150,150,150,0.2)' },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  explanationLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  explanationText: { fontSize: 14, lineHeight: 20 },

  footer: { padding: 20, borderTopWidth: 1 },
  finishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16 },
  finishBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});