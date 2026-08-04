import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Network, Trophy, BookOpen } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Master Networking',
    description: 'Learn computer networking concepts through interactive modules and practical examples.',
    icon: Network,
  },
  {
    id: '2',
    title: 'Gamified Learning',
    description: 'Earn XP, unlock achievements, and maintain your daily streak to level up your skills.',
    icon: Trophy,
  },
  {
    id: '3',
    title: 'Track Your Progress',
    description: 'Take quizzes, submit assignments, and get detailed analytics on your weak areas.',
    icon: BookOpen,
  }
];

export const OnboardingScreen = () => {
  const { theme } = useTheme();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => {
    const Icon = item.icon;
    return (
      <View style={[styles.slide, { width }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
          <Icon size={80} color={theme.colors.primary} strokeWidth={1.5} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                { backgroundColor: currentIndex === index ? theme.colors.primary : theme.colors.border },
                currentIndex === index && { width: 24 } 
              ]} 
            />
          ))}
        </View>

        <Button 
          title={currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next"} 
          onPress={handleNext} 
        />
        
        {currentIndex < ONBOARDING_DATA.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
            <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  iconContainer: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  footer: { padding: 24, paddingBottom: 40 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32, height: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  skipButton: { marginTop: 16, alignItems: 'center', padding: 8 },
  skipText: { fontSize: 14, fontWeight: '600' },
});