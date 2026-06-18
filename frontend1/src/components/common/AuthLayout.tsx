import React from "react";
import { 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthHeader from "./AuthHeader";
import CustomButton from "../common/CustomButton"; 
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import {
  ActivityIndicator,
} from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  buttonTitle: string;
  onButtonPress: () => void;
  isLoading?: boolean;
  googleLoading?: boolean;
  showGoogleAuth?: boolean;
  onGooglePress?: () => void;
  bottomText?: string;
  bottomLinkText?: string;
  onBottomLinkPress?: () => void;
  showForgotPassword?: boolean;
  onForgotPasswordPress?: () => void;
};

const AuthLayout = ({ 
  title, 
  subtitle, 
  children, 
  buttonTitle, 
  onButtonPress, 
  isLoading = false,
  googleLoading = false,
  showGoogleAuth = false,
  onGooglePress,
  bottomText,
  bottomLinkText,
  onBottomLinkPress,
  showForgotPassword = false,
  onForgotPasswordPress,
}: Props) => {
  const { colors } = useThemeStore();
  const styles = createThemedStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          
          {/* 1. HEADER (Static) */}
          <AuthHeader title={title} subtitle={subtitle} />

          {/* 2. FORM SCROLLABLE (Shrinks to fit content, scrolls if too large) */}
          <View style={styles.formWrapper}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              bounces={false} 
            >
              {children}

              {showForgotPassword && (
                <TouchableOpacity onPress={onForgotPasswordPress} style={styles.forgotPassword} activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* 3. CTA BUTTONS & REDIRECT (Static) */}
          <View style={styles.ctaContainer}>
            <CustomButton 
              title={buttonTitle} 
              onPress={onButtonPress} 
              loading={isLoading} 
            />

            {showGoogleAuth && (
              <>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={onGooglePress}
                  activeOpacity={0.7}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary}
                    />
                  ) : (
                    <Text style={styles.googleButtonText}>
                      Continue with Google
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {bottomText && bottomLinkText && (
              <TouchableOpacity onPress={onBottomLinkPress} style={styles.bottomLinkContainer} activeOpacity={0.7}>
                <Text style={styles.bottomText}>
                  {bottomText} <Text style={styles.bottomLinkHighlight}>{bottomLinkText}</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createThemedStyles = (colors: ThemePalette) => StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  keyboardView: { 
    flex: 1 
  },
  container: { 
    flex: 1, 
    padding: 24, 
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    justifyContent: "center", // Keeps everything perfectly centered
  },
  formWrapper: { 
    backgroundColor: colors.surface, 
    borderRadius: 20, 
    marginVertical: 24, // Spacing between Header and Buttons
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 3,
    flexShrink: 1, // THE FIX: Allows it to wrap tight around 2 fields, but prevents it from breaking the screen with 5 fields
  },
  formContent: { 
    padding: 24,
    gap: 16, 
  },
  ctaContainer: { 
    gap: 16, 
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  googleButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  googleButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  bottomLinkContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  bottomText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  bottomLinkHighlight: {
    color: colors.primary,
    fontWeight: "800",
  },
});

export default AuthLayout;