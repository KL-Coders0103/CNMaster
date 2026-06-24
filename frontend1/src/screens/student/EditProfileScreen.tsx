import React, { useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import CustomDropdown from "../../components/common/CustomDropdown";

import { editProfileSchema, EditProfileForm } from "../../utils/editProfileSchema";
import { useProfileStore } from "../../store/profileStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const BRANCHES = ["CSE", "IT", "AIDS", "AIML"];

const SECTIONS_MAP = {
  CSE: ["A", "B", "C", "D"],
  IT: ["A", "B"],
  AIDS: ["A"],
  AIML: ["A"],
};

const EditProfileScreen = () => {
  const { profile, updateUserProfile } = useProfileStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        mobileNumber: profile.mobileNumber ?? "",
        year: profile.year ?? "1st Year",
        branch: profile.branch ?? "CSE",
        section: profile.section ?? "A",
      });
    }
  }, [profile, reset]);

  const branch = watch("branch");

  const onSubmit = async (data: EditProfileForm) => {
    try {
      await updateUserProfile(data);
      Toast.show({
        type: "success",
        text1: "Profile Updated",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Update Failed",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>
            Update your personal and academic information.
          </Text>
        </View>

        {/* Personal Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>
          
          <View style={styles.card}>
            <Controller
              control={control}
              name="fullName"
              render={({ field }) => (
                <CustomInput
                  label="Full Name"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.fullName?.message}
                />
              )}
            />

            <View style={styles.divider} />

            <Controller
              control={control}
              name="mobileNumber"
              render={({ field }) => (
                <CustomInput
                  label="Mobile Number"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.mobileNumber?.message}
                />
              )}
            />
          </View>
        </View>

        {/* Academic Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="book" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Academic Details</Text>
          </View>

          <View style={styles.card}>
            <Controller
              control={control}
              name="year"
              render={({ field }) => (
                <CustomDropdown
                  label="Year"
                  value={field.value ?? ""}
                  options={YEARS}
                  onSelect={field.onChange}
                />
              )}
            />

            <View style={styles.divider} />

            <Controller
              control={control}
              name="branch"
              render={({ field }) => (
                <CustomDropdown
                  label="Branch"
                  value={field.value ?? ""}
                  options={BRANCHES}
                  onSelect={(value) => {
                    field.onChange(value);
                    // Reset section to first valid option when branch changes
                    setValue(
                      "section",
                      SECTIONS_MAP[value as keyof typeof SECTIONS_MAP][0],
                      {shouldValidate: true}
                    );
                  }}
                />
              )}
            />

            <View style={styles.divider} />

            <Controller
              control={control}
              name="section"
              render={({ field }) => (
                <CustomDropdown
                  label="Section"
                  value={field.value ?? ""}
                  options={SECTIONS_MAP[branch as keyof typeof SECTIONS_MAP] ?? ["A"]}
                  onSelect={field.onChange}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <CustomButton
            title="Save Changes"
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
      gap: 16, // Handles internal spacing between inputs
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
    },
    footer: {
      marginTop: 8,
    },
  });

export default EditProfileScreen;