import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { useQuizStore } from '../../store/useQuizStore';

export const ActiveQuizScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  
  const { questions, answers, selectAnswer, submitQuiz, isSubmitting, clearActiveQuiz } = useQuizStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleExit = () => {
    Alert.alert(
      "Exit Quiz?",
      "Your progress will be lost and this attempt will remain incomplete.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", style: "destructive", onPress: () => {
            clearActiveQuiz();
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleSubmit = async () => {
    if (answeredCount < questions.length) {
      Alert.alert("Incomplete", "Please answer all questions before submitting.");
      return;
    }

    const result = await submitQuiz();
    if (result) {
      navigation.replace('QuizResultScreen', { attemptId: result.id });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>

      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleExit}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textSecondary }]}>
          {currentIndex + 1} of {questions.length}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.surface }]}>
        <Animated.View 
          style={[styles.progressBarFill, { backgroundColor: theme.colors.primary, width: `${progressPercentage}%` }]} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View key={currentQuestion.id} entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(300)}>
          
          <View style={[styles.badge, { backgroundColor: `${theme.colors.primary}15` }]}>
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{currentQuestion.difficulty}</Text>
          </View>
          
          <Text style={[styles.questionText, { color: theme.colors.text }]}>
            {currentQuestion.question}
          </Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  style={[
                    styles.optionCard,
                    { 
                      backgroundColor: isSelected ? `${theme.colors.primary}10` : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border
                    }
                  ]}
                  onPress={() => selectAnswer(currentQuestion.id, option)}
                >
                  <View style={[
                    styles.radioCircle,
                    { borderColor: isSelected ? theme.colors.primary : theme.colors.textSecondary }
                  ]}>
                    {isSelected && <View style={[styles.radioFill, { backgroundColor: theme.colors.primary }]} />}
                  </View>
                  <Text style={[styles.optionText, { color: theme.colors.text }]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
        <TouchableOpacity 
          style={[styles.navBtn, { opacity: currentIndex === 0 ? 0 : 1 }]} 
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navBtnText, { color: theme.colors.textSecondary }]}>Prev</Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity 
            style={[
              styles.submitBtn, 
              { backgroundColor: answeredCount === questions.length ? theme.colors.primary : theme.colors.surface }
            ]}
            disabled={answeredCount < questions.length || isSubmitting}
            onPress={handleSubmit}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={[styles.submitBtnText, { color: answeredCount === questions.length ? '#FFF' : theme.colors.textSecondary }]}>Submit</Text>
                <CheckCircle2 size={20} color={answeredCount === questions.length ? '#FFF' : theme.colors.textSecondary} />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
            <Text style={[styles.navBtnText, { color: theme.colors.primary }]}>Next</Text>
            <ChevronRight size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1 },
  iconBtn: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  
  progressBarContainer: { height: 6, width: '100%' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  scrollContent: { padding: 24, paddingBottom: 40 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 16 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  questionText: { fontSize: 22, fontWeight: '700', lineHeight: 32, marginBottom: 32 },

  optionsContainer: { gap: 16 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 2 },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  radioFill: { width: 12, height: 12, borderRadius: 6 },
  optionText: { flex: 1, fontSize: 16, fontWeight: '600', lineHeight: 24 },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1 },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8 },
  navBtnText: { fontSize: 16, fontWeight: '700' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 },
  submitBtnText: { fontSize: 16, fontWeight: '800' }
});