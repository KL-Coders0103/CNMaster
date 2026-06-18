import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { deleteAccount } from "../../services/profileService";
import { clearTokens } from "../../utils/secureStorage";

const DeleteAccountScreen = () => {
  const { colors } = useThemeStore();
  const { clearAuth } = useAuthStore();
  const styles = createStyles(colors);

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePress = () => {
    if (!password) {
      Toast.show({ type: "error", text1: "Password is required" });
      return;
    }

    Alert.alert(
      "Final Confirmation",
      "This action cannot be undone. All your progress, notes, and achievements will be permanently erased. Are you absolutely sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete My Account",
          style: "destructive",
          onPress: executeDelete,
        },
      ]
    );
  };

  const executeDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAccount(password);
      
      // Clear local state and kick them to the auth screen
      await clearTokens();
      clearAuth();
      
      Toast.show({ type: "success", text1: "Account Deleted" });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Deletion Failed",
        text2: error?.response?.data?.message || "Incorrect password or server error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <View style={styles.warningContainer}>
            <View style={styles.iconCircle}>
              <Feather name="alert-triangle" size={32} color="#EF4444" />
            </View>
            <Text style={styles.warningTitle}>Delete Account</Text>
            <Text style={styles.warningText}>
              You are about to permanently delete your CN Master account. This action will erase all your learning history, XP, streaks, and saved notes.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.instructionText}>
              Please enter your password to confirm this action.
            </Text>
            <CustomInput
              label="Current Password"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Permanently Delete Account"
              onPress={handleDeletePress}
              loading={isLoading}
              style={{ backgroundColor: "#EF4444" }}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  warningContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(239, 68, 68, 0.1)", // Light red background
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: "auto",
    paddingTop: 20,
  },
});

export default DeleteAccountScreen;