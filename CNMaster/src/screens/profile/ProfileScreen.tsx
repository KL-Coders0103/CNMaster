import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { 
  Settings, ChevronRight, Trophy, Flame, Target, 
  Award, LogOut, CheckCircle2, User as UserIcon
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { useProfileStore } from '../../store/useProfileStore';

export const ProfileScreen = () => {
  const { theme } = useTheme();
  const { profile, analytics, achievementSummary, leaderboardRank, isLoading, fetchProfileData, logout } = useProfileStore();

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <Text style={{ color: theme.colors.textSecondary }}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Settings size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchProfileData} tintColor={theme.colors.primary} />
        }
      >
        <Animated.View entering={FadeIn.duration(400)} style={styles.profileSection}>
          <View style={[styles.avatarContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <UserIcon size={40} color={theme.colors.textSecondary} />
            )}
            <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.levelBadgeText}>{analytics?.level || 1}</Text>
            </View>
          </View>
          
          <Text style={[styles.name, { color: theme.colors.text }]}>{profile?.fullName}</Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{profile?.email}</Text>
          
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>{profile?.branch} - {profile?.year}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <View style={[styles.gridBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Target size={20} color={theme.colors.primary} />
              <Text style={[styles.gridValue, { color: theme.colors.text }]}>{analytics?.currentXp || 0}</Text>
              <Text style={[styles.gridLabel, { color: theme.colors.textSecondary }]}>Total XP</Text>
            </View>
            <View style={[styles.gridBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Trophy size={20} color="#FACC15" />
              <Text style={[styles.gridValue, { color: theme.colors.text }]}>#{leaderboardRank || '-'}</Text>
              <Text style={[styles.gridLabel, { color: theme.colors.textSecondary }]}>Global Rank</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Flame size={20} color={theme.colors.error} />
              <Text style={[styles.gridValue, { color: theme.colors.text }]}>{analytics?.currentStreak || 0}</Text>
              <Text style={[styles.gridLabel, { color: theme.colors.textSecondary }]}>Day Streak</Text>
            </View>

            <View style={[styles.gridBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <CheckCircle2 size={20} color="#10B981" />
              <Text style={[styles.gridValue, { color: theme.colors.text }]}>{analytics?.tasksCompleted || 0}</Text>
              <Text style={[styles.gridLabel, { color: theme.colors.textSecondary }]}>Tasks Done</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(250, 204, 21, 0.1)' }]}>
              <Award size={22} color="#FACC15" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Achievements</Text>
              <Text style={[styles.menuSub, { color: theme.colors.textSecondary }]}>
                {achievementSummary?.unlockedAchievements || 0} of {achievementSummary?.totalAchievements || 0} Unlocked
              </Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.settingsGroup}>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Edit Profile</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Account Settings</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={logout}
            style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginTop: 16 }]}
          >
            <LogOut size={20} color={theme.colors.error} />
            <Text style={[styles.menuTitle, { color: theme.colors.error, marginLeft: 12 }]}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  iconBtn: { padding: 4 },

  profileSection: { alignItems: 'center', marginVertical: 24 },
  avatarContainer: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 16 },
  avatar: { width: 94, height: 94, borderRadius: 47 },
  levelBadge: { position: 'absolute', bottom: -4, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  levelBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  email: { fontSize: 14, fontWeight: '500', marginBottom: 12 },
  tagsContainer: { flexDirection: 'row', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '600' },

  gridContainer: { gap: 12, marginBottom: 24 },
  gridRow: { flexDirection: 'row', gap: 12 },
  gridBox: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
  gridValue: { fontSize: 24, fontWeight: '800', marginTop: 12, marginBottom: 2 },
  gridLabel: { fontSize: 12, fontWeight: '600' },

  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  menuIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  menuSub: { fontSize: 12, fontWeight: '500' },
  
  settingsGroup: { marginTop: 12 }
});