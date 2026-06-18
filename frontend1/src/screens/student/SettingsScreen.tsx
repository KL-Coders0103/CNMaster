import React, { useEffect, useState } from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import CustomButton from "../../components/common/CustomButton";
import { useProfileStore } from "../../store/profileStore";
import { useThemeStore } from "../../store/themeStore";

const SettingsScreen = () => {
  const { settings, fetchSettings, saveSettings } = useProfileStore();
  const { colors, isDarkMode, toggleTheme } = useThemeStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setNotificationsEnabled(settings.notificationsEnabled);
      setReminderEnabled(settings.reminderEnabled);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings({
        notificationsEnabled,
        reminderEnabled,
      });
      Toast.show({ type: "success", text1: "Settings Updated" });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper component for premium setting cards
  const SettingItem = ({ icon, title, description, value, onValueChange }: any) => (
    <View style={{
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      backgroundColor: colors.surface, padding: 20, borderRadius: 16, marginBottom: 12,
      borderWidth: 1, borderColor: colors.border
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(37, 99, 235, 0.1)", justifyContent: "center", alignItems: "center", marginRight: 16 }}>
          <Feather name={icon} size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary }}>{title}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{description}</Text>
        </View>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={"#ffffff"}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        <Text style={{ fontSize: 14, fontWeight: "800", color: colors.textSecondary, textTransform: "uppercase", marginBottom: 12, marginLeft: 8 }}>
          App Preferences
        </Text>

        <SettingItem 
          icon="moon" 
          title="Dark Mode" 
          description="Toggle application theme"
          value={isDarkMode} 
          onValueChange={toggleTheme} 
        />

        <Text style={{ fontSize: 14, fontWeight: "800", color: colors.textSecondary, textTransform: "uppercase", marginTop: 24, marginBottom: 12, marginLeft: 8 }}>
          Notifications
        </Text>

        <SettingItem 
          icon="bell" 
          title="Push Notifications" 
          description="Receive updates on assignments and quizzes"
          value={notificationsEnabled} 
          onValueChange={setNotificationsEnabled} 
        />

        <SettingItem 
          icon="clock" 
          title="Study Reminders" 
          description="Daily nudges to keep your streak alive"
          value={reminderEnabled} 
          onValueChange={setReminderEnabled} 
        />

        <View style={{ marginTop: 32 }}>
          <CustomButton title="Save Settings" onPress={handleSave} loading={isSaving} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;