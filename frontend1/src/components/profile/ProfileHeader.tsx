import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { getProfileHeaderStyles } from "../../styles/components/profile/profileHeaderStyles";

type Props = {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  level: number;
  onAvatarPress: () => void;
  isUploading?: boolean; // 👈 Added this
};

const ProfileHeader = ({ fullName, email, avatarUrl, level, onAvatarPress, isUploading = false }: Props) => {
  const { colors } = useThemeStore();
  const styles = getProfileHeaderStyles(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={onAvatarPress} disabled={isUploading}>
        <View style={{ position: "relative" }}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={40} color={colors.white} />
            </View>
          )}

          {/* 👈 The Magic Loader Overlay */}
          {isUploading && (
            <View style={[styles.avatar, { position: "absolute", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }]}>
              <ActivityIndicator size="large" color={colors.white} />
            </View>
          )}

          <View style={styles.cameraBadge}>
            <Feather name="camera" size={14} color={colors.white} />
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.name}>{fullName}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Level {level}</Text>
      </View>
    </View>
  );
};

export default ProfileHeader;