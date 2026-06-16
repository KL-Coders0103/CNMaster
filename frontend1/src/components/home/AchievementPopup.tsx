import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAchievementPopupStyles } from "../../styles/components/home/achievementPopupStyles";
import { useThemeStore } from "../../store/themeStore";

type Props = {
  visible: boolean;
  title: string;
  description: string;
  xp: number;
  onClose: () => void;
};

const AchievementPopup = ({ visible, title, description, xp, onClose }: Props) => {
  const { colors } = useThemeStore();
  const styles = getAchievementPopupStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.achievementOverlay}>
        <View style={styles.achievementCard}>
          {/* 👈 Dynamic color for the trophy */}
          <Ionicons name="trophy" size={56} color={colors.warning} />

          <Text style={styles.achievementTitle}>Achievement Unlocked</Text>
          <Text style={styles.achievementName}>{title}</Text>
          <Text style={styles.achievementDescription}>{description}</Text>
          <Text style={styles.achievementXP}>+{xp} XP</Text>

          <TouchableOpacity style={styles.achievementButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.achievementButtonText}>Awesome</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AchievementPopup;