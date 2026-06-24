import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { changePasswordSchema, ChangePasswordForm } from "../../utils/changePasswordSchema";
import { useProfileStore } from "../../store/profileStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const ChangePasswordScreen = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { changeUserPassword } = useProfileStore();
  const [strength, setStrength] = useState(0);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPasswordValue = watch("newPassword");

  // Calculate Password Strength
  useEffect(() => {
    let score = 0;
    if (!newPasswordValue) {
      setStrength(0);
      return;
    }
    if (newPasswordValue.length >= 8) score++;
    if (/[A-Z]/.test(newPasswordValue)) score++;
    if (/[0-9]/.test(newPasswordValue)) score++;
    if (/[^A-Za-z0-9]/.test(newPasswordValue)) score++;
    setStrength(score);
  }, [newPasswordValue]);

  useEffect(() => {
  if (errors.newPassword) {
    // This clears the custom error when the user modifies the input
    clearErrors("newPassword");
  }
}, [newPasswordValue]);

  const onSubmit = async (data: ChangePasswordForm) => {
    // Frontend Validation: Prevent using same password
    if (data.currentPassword === data.newPassword) {
      setError("newPassword", {
        message: "New password must be different from current password",
      });
      return;
    }

    try {
      await changeUserPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      reset();
      Toast.show({ type: "success", text1: "Password Updated" });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  const getStrengthColor = () => {
    if (strength <= 1) return "#EF4444"; // Red
    if (strength === 2) return "#F59E0B"; // Orange
    if (strength === 3) return "#3B82F6"; // Blue
    return "#10B981"; // Green
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Update Password</Text>
          <Text style={styles.headerSubtitle}>
            Ensure your account is using a long, random password to stay secure.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="shield" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Security Verification</Text>
          </View>

          <View style={styles.card}>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field }) => (
                <CustomInput
                  label="Current Password"
                  value={field.value}
                  onChangeText={field.onChange}
                  isPassword
                  error={errors.currentPassword?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="key" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>New Credentials</Text>
          </View>

          <View style={styles.card}>
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <View>
                  <CustomInput
                    label="New Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    isPassword
                    error={errors.newPassword?.message}
                  />

                  {/* Sleek Password Strength Bar with Label */}
                  {field.value?.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={styles.strengthBars}>
                        {[1, 2, 3, 4].map((step) => (
                          <View
                            key={step}
                            style={[
                              styles.strengthBar,
                              {
                                backgroundColor:
                                  strength >= step
                                    ? getStrengthColor()
                                    : colors.border,
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <Text
                        style={[
                          styles.strengthLabel,
                          { color: getStrengthColor() },
                        ]}
                      >
                        {getStrengthLabel()}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />

            <View style={styles.divider} />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <CustomInput
                  label="Confirm New Password"
                  value={field.value}
                  onChangeText={field.onChange}
                  isPassword
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <CustomButton
            title="Update Password"
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      lineHeight: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      marginLeft: 4,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
      gap: 16,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
    },
    strengthContainer: {
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    strengthBars: {
      flexDirection: "row",
      gap: 6,
      flex: 1,
      marginRight: 12,
    },
    strengthBar: {
      flex: 1,
      height: 4,
      borderRadius: 2,
    },
    strengthLabel: {
      fontSize: 12,
      fontWeight: "700",
      minWidth: 45,
      textAlign: "right",
    },
    footer: {
      marginTop: 8,
    },
  });

export default ChangePasswordScreen;