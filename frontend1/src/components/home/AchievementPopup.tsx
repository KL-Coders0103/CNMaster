import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type Props = {
  visible: boolean;
  title: string;
  description: string;
  xp: number;
  onClose: () => void;
};

const AchievementPopup = ({ visible, title, description, xp, onClose }: Props) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          
          <View style={styles.iconRing}>
            <View style={styles.iconCircle}>
              <Feather name="award" size={48} color="#F59E0B" />
            </View>
          </View>

          <Text style={styles.headerText}>Achievement Unlocked!</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{xp} XP</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Awesome</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "rgba(245, 158, 11, 0.1)", // Light amber
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(245, 158, 11, 0.2)", // Darker amber tint
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F59E0B",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  xpBadge: {
    backgroundColor: "rgba(37, 99, 235, 0.1)", // Primary tint
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.2)",
  },
  xpText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  button: {
    width: "100%",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default AchievementPopup;