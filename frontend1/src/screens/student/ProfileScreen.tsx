import React, { useEffect, useState, useRef } from "react";
import { ScrollView, View, Alert, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileStatsCard from "../../components/profile/ProfileStatsCard";
import ProfileCompletionCard from "../../components/profile/ProfileCompletionCard";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";
import AvatarActionSheet from "../../components/profile/AvatarActionSheet"; 
import { useProfileStore } from "../../store/profileStore";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { getProfileScreenStyles } from "../../styles/screens/profileScreenStyles";
import { clearTokens } from "../../utils/secureStorage";

const ProfileScreen = ({ navigation }: any) => {
  const { profile, completion, fetchProfile, uploadProfileAvatar, removeProfileAvatar } = useProfileStore();
  const { clearAuth } = useAuthStore();
  const { colors } = useThemeStore();
  const styles = getProfileScreenStyles(colors);

  const bottomSheetRef = useRef<BottomSheetModal>(null); 
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await clearTokens();
          clearAuth();
        },
      },
    ]);
  };

  const pickFromGallery = async () => {
    bottomSheetRef.current?.dismiss(); 
    
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      setAvatarUploading(true);
      await uploadProfileAvatar(result.assets[0].uri);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    bottomSheetRef.current?.dismiss(); 
    setAvatarUploading(true);
    try {
      await removeProfileAvatar();
    } finally {
      setAvatarUploading(false);
    }
  };

  if (!profile) {
    return <SafeAreaView style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        
        <ProfileHeader
          fullName={profile.fullName}
          email={profile.email}
          avatarUrl={profile.avatarUrl ?? undefined}
          level={profile.level}
          isUploading={avatarUploading}
          onAvatarPress={() => bottomSheetRef.current?.present()} 
        />

        <ProfileStatsCard
          streak={profile.streakDays}
          xp={profile.xpCurrent}
          achievements={profile.achievementCount}
        />

        <ProfileCompletionCard percentage={completion} />

        {/* --- MENU SECTION --- */}
        <View style={styles.menuSection}>
          {/* Grouped Analytics Menu Item */}
          <ProfileMenuItem 
            title="Analytics & Progress" 
            icon="pie-chart" 
            onPress={() => navigation.navigate("Analytics")} 
          />
          
          <ProfileMenuItem title="Edit Profile" icon="edit-2" onPress={() => navigation.navigate("EditProfile")} />
          <ProfileMenuItem title="Achievements" icon="award" onPress={() => navigation.navigate("Achievements")} />
          <ProfileMenuItem title="Activity History" icon="activity" onPress={() => navigation.navigate("ActivityHistory")} />
          <ProfileMenuItem title="Leaderboard" icon="bar-chart-2" onPress={() => navigation.navigate("Leaderboard")} />
          <ProfileMenuItem title="Settings" icon="settings" onPress={() => navigation.navigate("Settings")} />
          <ProfileMenuItem title="Change Password" icon="lock" onPress={() => navigation.navigate("ChangePassword")} />
        </View>

        {/* --- DANGER ZONE --- */}
        <View style={{ marginHorizontal: 20, marginTop: 32, gap: 12 }}>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleLogout}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}
          >
            <Feather name="log-out" size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary }}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => navigation.navigate("DeleteAccount")}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: 16 }}
          >
            <Feather name="trash-2" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#EF4444" }}>Delete Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <AvatarActionSheet 
        ref={bottomSheetRef}
        onGallery={pickFromGallery}
        onCamera={() => { bottomSheetRef.current?.dismiss(); }}
        onRemove={handleRemoveAvatar}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;