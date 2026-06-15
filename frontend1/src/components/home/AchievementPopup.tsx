import React from "react";

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  achievementPopupStyles,
} from "../../styles/components/home/achievementPopupStyles";

type Props = {
  visible: boolean;
  title: string;
  description: string;
  xp: number;
  onClose: () => void;
};

const AchievementPopup = ({
  visible,
  title,
  description,
  xp,
  onClose,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={
          achievementPopupStyles.achievementOverlay
        }
      >
        <View
          style={
            achievementPopupStyles.achievementCard
          }
        >
          <Ionicons
            name="trophy"
            size={56}
            color="#F59E0B"
          />

          <Text
            style={
              achievementPopupStyles.achievementTitle
            }
          >
            Achievement Unlocked
          </Text>

          <Text
            style={
              achievementPopupStyles.achievementName
            }
          >
            {title}
          </Text>

          <Text
            style={
              achievementPopupStyles.achievementDescription
            }
          >
            {description}
          </Text>

          <Text
            style={
              achievementPopupStyles.achievementXP
            }
          >
            +{xp} XP
          </Text>

          <TouchableOpacity
            style={
              achievementPopupStyles.achievementButton
            }
            onPress={onClose}
          >
            <Text
              style={
                achievementPopupStyles.achievementButtonText
              }
            >
              Awesome
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AchievementPopup;