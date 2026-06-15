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

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  
  buttonTitle: string;
  onButtonPress: () => void;
  isLoading?: boolean;

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
  subtitle = "Learn • Practice • Grow", 
  children, 
  buttonTitle, 
  onButtonPress, 
  isLoading = false,
  showGoogleAuth = false,
  onGooglePress,
  bottomText,
  bottomLinkText,
  onBottomLinkPress,
  showForgotPassword = false,
  onForgotPasswordPress,
}: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.innerContainer}>
          
          <AuthHeader title={title} subtitle={subtitle} />
          
          {/* Form Container - Now dynamically sizes based on content! */}
          <View style={styles.formContainer}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              bounces={false} // Stops weird bouncing on small forms
            >
              {children}

              {showForgotPassword && (
                <TouchableOpacity onPress={onForgotPasswordPress} style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <View style={styles.ctaContainer}>
            <CustomButton 
              title={buttonTitle} 
              onPress={onButtonPress} 
              loading={isLoading} 
            />

            {showGoogleAuth && (
              <View style={styles.googleSection}>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity style={styles.googleButton} onPress={onGooglePress}>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            )}

            {bottomText && bottomLinkText && (
              <TouchableOpacity onPress={onBottomLinkPress} style={styles.bottomLinkContainer}>
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

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  container: { 
    flex: 1 
  },
  innerContainer: { 
    flex: 1, 
    padding: 24, 
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    justifyContent: "center", // 👈 Centers the Login form beautifully
  },
  formContainer: { 
    flexShrink: 1, // 👈 THE MAGIC FIX: Hugs content, shrinks & scrolls if too big!
    backgroundColor: "#FFFFFF", 
    borderRadius: 16, 
    padding: 24, 
    marginBottom: 24, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 3,
  },
  scrollContent: { 
    gap: 16, 
    paddingBottom: 4, // Reduced padding so small forms look tight
  },
  ctaContainer: { 
    gap: 16, 
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  googleSection: {
    gap: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  googleButtonText: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomLinkContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  bottomText: {
    color: "#64748B",
    fontSize: 14,
  },
  bottomLinkHighlight: {
    color: "#2563EB",
    fontWeight: "700",
  },
});

export default AuthLayout;