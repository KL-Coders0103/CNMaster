import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell, CheckCheck, FileText, Target, Zap, AlertCircle } from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { useNotificationStore } from '../../store/useNotificationStore';
import { NotificationType } from '../../types';

export const NotificationsScreen = () => {
  const { theme } = useTheme();
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'ASSIGNMENT': return <FileText size={20} color={theme.colors.primary} />;
      case 'QUIZ': return <Target size={20} color="#F59E0B" />;
      case 'ACHIEVEMENT': return <Zap size={20} color="#10B981" />;
      default: return <AlertCircle size={20} color={theme.colors.textSecondary} />;
    }
  };

  const getBackgroundColorForType = (type: NotificationType) => {
    switch (type) {
      case 'ASSIGNMENT': return `${theme.colors.primary}15`;
      case 'QUIZ': return 'rgba(245, 158, 11, 0.15)';
      case 'ACHIEVEMENT': return 'rgba(16, 185, 129, 0.15)';
      default: return theme.colors.surface;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
            <CheckCheck size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchNotifications} tintColor={theme.colors.primary} />}
      >
        
        {notifications.length === 0 && !isLoading ? (
          <View style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
            <Bell size={40} color={theme.colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>All caught up!</Text>
            <Text style={[styles.emptyDesc, { color: theme.colors.textSecondary }]}>
              You don't have any notifications right now.
            </Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <Animated.View key={notification.id} entering={FadeInDown.delay(index * 50)}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => markAsRead(notification.id)}
                style={[
                  styles.notificationCard, 
                  { 
                    backgroundColor: notification.isRead ? theme.colors.background : theme.colors.surface,
                    borderColor: notification.isRead ? 'transparent' : theme.colors.border
                  }
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: getBackgroundColorForType(notification.type) }]}>
                  {getIconForType(notification.type)}
                </View>

                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Text 
                      style={[styles.title, { color: theme.colors.text, fontWeight: notification.isRead ? '600' : '800' }]}
                      numberOfLines={1}
                    >
                      {notification.title}
                    </Text>
                    <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
                      {formatTimeAgo(notification.createdAt)}
                    </Text>
                  </View>
                  <Text 
                    style={[styles.message, { color: notification.isRead ? theme.colors.textSecondary : theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {notification.message}
                  </Text>
                </View>

                {!notification.isRead && (
                  <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
                )}
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  markAllBtn: { padding: 8, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 12 },
  
  scrollContent: { paddingTop: 8 },

  emptyCard: { padding: 40, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', margin: 20, marginTop: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  emptyDesc: { fontSize: 15, textAlign: 'center' },

  notificationCard: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingHorizontal: 20 },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  
  content: { flex: 1, marginRight: 12 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { flex: 1, fontSize: 15, marginRight: 8 },
  time: { fontSize: 12, fontWeight: '500' },
  message: { fontSize: 14, lineHeight: 20 },

  unreadDot: { width: 10, height: 10, borderRadius: 5 },
  divider: { height: 1, marginHorizontal: 20, opacity: 0.5 },
});