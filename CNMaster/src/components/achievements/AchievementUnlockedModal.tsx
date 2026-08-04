import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat, 
  withTiming, 
  Easing,
  FadeIn,
  ZoomIn
} from 'react-native-reanimated';
import { Trophy, Star } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../ui/Button';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
}

interface Props {
  achievement: Achievement | null;
  onDismiss: () => void;
  isLoading: boolean;
}

export const AchievementUnlockedModal: React.FC<Props> = ({ achievement, onDismiss, isLoading }) => {
  const { theme } = useTheme();
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (achievement) {
      glowScale.value = withRepeat(
        withTiming(1.5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      glowOpacity.value = withRepeat(
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [achievement]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  if (!achievement) return null;

  return (
    <Modal transparent visible={!!achievement} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View 
          entering={ZoomIn.duration(400).springify()} 
          style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <Animated.View entering={FadeIn.delay(300)} style={[styles.tag, { backgroundColor: 'rgba(250, 204, 21, 0.1)' }]}>
            <Star size={14} color="#FACC15" fill="#FACC15" />
            <Text style={styles.tagText}>ACHIEVEMENT UNLOCKED</Text>
          </Animated.View>

          <View style={styles.iconContainer}>
            <Animated.View style={[styles.glowRing, { backgroundColor: '#FACC15' }, animatedGlowStyle]} />
            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Trophy size={48} color="#FACC15" strokeWidth={1.5} />
            </View>
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>{achievement.title}</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {achievement.description}
          </Text>

          {achievement.xp > 0 && (
            <View style={[styles.rewardBox, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Text style={[styles.rewardLabel, { color: theme.colors.textSecondary }]}>Reward</Text>
              <Text style={[styles.rewardValue, { color: theme.colors.primary }]}>+{achievement.xp} XP</Text>
            </View>
          )}

          <View style={styles.spacer} />

          <Button 
            title="Claim Reward" 
            onPress={onDismiss} 
            isLoading={isLoading} 
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: width - 48, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6, marginBottom: 32 },
  tagText: { color: '#FACC15', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  iconContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  glowRing: { position: 'absolute', width: 80, height: 80, borderRadius: 40 },
  iconWrapper: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  description: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  rewardBox: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  rewardLabel: { fontSize: 14, fontWeight: '600' },
  rewardValue: { fontSize: 16, fontWeight: '800' },
  spacer: { height: 24 },
});