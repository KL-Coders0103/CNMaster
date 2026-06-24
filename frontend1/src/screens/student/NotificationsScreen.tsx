import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { useNotificationStore } from "../../store/notificationStore"; 

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  // CRITICAL: Pulling real state and actions from your store
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const hasUnread = notifications.some(n => !n.isRead);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      activeOpacity={0.7}
      // CRITICAL: Triggers the backend PATCH request to mark as read
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.iconContainer}>
        <Feather 
          name={item.title.toLowerCase().includes("assignment") ? "file-text" : "bell"} 
          size={20} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        
        {/* CRITICAL: "Mark All Read" button appears if there are unread items */}
        {hasUnread ? (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Feather name="check-circle" size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} /> 
        )}
      </View>

      {isLoading && notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="bell-off" size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
          <Text style={styles.emptyText}>You're all caught up!</Text>
          <Text style={styles.emptySubtext}>No new notifications right now.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: colors.textPrimary },
  markAllButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-end" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  emptySubtext: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
  listContent: { padding: 16, gap: 12 },
  notificationCard: {
    flexDirection: "row", padding: 16, backgroundColor: colors.surface,
    borderRadius: 16, borderWidth: 1, borderColor: colors.border,
  },
  unreadCard: { backgroundColor: colors.primaryLight || "rgba(79, 70, 229, 0.05)", borderColor: "rgba(79, 70, 229, 0.2)" },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", marginRight: 12 },
  contentContainer: { flex: 1 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  unreadText: { fontWeight: "800", color: colors.primary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  message: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  date: { fontSize: 12, color: colors.textSecondary, fontWeight: "500" },
});

export default NotificationsScreen;