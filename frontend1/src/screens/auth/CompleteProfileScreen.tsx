import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

import AuthLayout from "../../components/common/AuthLayout";
import CustomInput from "../../components/common/CustomInput";
import CustomDropdown from "../../components/common/CustomDropdown";
import { completeProfileSchema, CompleteProfileFormData } from "../../utils/completeProfileSchema";
import { completeProfile } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const BRANCHES = ["CSE", "IT", "AIDS", "AIML"];
const SECTIONS_MAP: Record<string, string[]> = {
  "CSE": ["A", "B", "C", "D"],
  "IT": ["A", "B"],
  "AIDS": ["A"],
  "AIML": ["A"],
};

const CompleteProfileScreen = () => {
  const { user, accessToken, refreshToken, setAuth } = useAuthStore();

  const isGoogleUser = user?.provider === "google";

  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      mobileNumber: user?.mobileNumber ?? "",
      password: "", confirmPassword: "",
      year: user?.year ?? YEARS[0], 
      branch: user?.branch ?? BRANCHES[0], 
      section: user?.section ?? SECTIONS_MAP["CSE"][0],
      isGoogleUser,
    },
  });

  const onSubmit = async (data: CompleteProfileFormData) => {
    try {
      const payload = {
        mobileNumber: data.mobileNumber || undefined,
        password: data.password || undefined,
        year: data.year, branch: data.branch, section: data.section,
      };
      const response = await completeProfile(payload);
      setAuth(accessToken!, refreshToken!, response.data.user);
      Toast.show({ type: "success", text1: "Profile Completed" });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Failed", text2: error?.response?.data?.message ?? "Something went wrong" });
    }
  };

  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="Help us personalize your learning journey by sharing your academic details."
      buttonTitle="Complete Profile"
      onButtonPress={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      {isGoogleUser && (
        <>
          <Controller control={control} name="mobileNumber" render={({ field }) => <CustomInput label="Mobile Number" placeholder="Enter mobile number" prefix="+91" value={field.value} onChangeText={field.onChange} keyboardType="number-pad" error={errors.mobileNumber?.message} />} />
          <Controller control={control} name="password" render={({ field }) => <CustomInput label="Password" placeholder="Create password" value={field.value} onChangeText={field.onChange} isPassword error={errors.password?.message} />} />
          <Controller control={control} name="confirmPassword" render={({ field }) => <CustomInput label="Confirm Password" placeholder="Confirm password" value={field.value} onChangeText={field.onChange} isPassword error={errors.confirmPassword?.message} />} />
        </>
      )}

      <Controller
        control={control}
        name="year"
        render={({ field }) => (
          <CustomDropdown 
            label="Academic Year"
            placeholder="Select Year"
            value={field.value}
            options={YEARS}
            onSelect={field.onChange}
            error={errors.year?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="branch"
        render={({ field }) => (
          <CustomDropdown 
            label="Branch"
            placeholder="Select Branch"
            value={field.value}
            options={BRANCHES}
            onSelect={(val) => {
              field.onChange(val);
              setValue("section", SECTIONS_MAP[val][0]); 
            }}
            error={errors.branch?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="section"
        render={({ field }) => {
          const currentBranch = control._formValues.branch || BRANCHES[0];
          const availableSections = SECTIONS_MAP[currentBranch] || ["A"];
          
          return (
            <CustomDropdown 
              label="Section"
              placeholder="Select Section"
              value={field.value}
              options={availableSections}
              onSelect={field.onChange}
              error={errors.section?.message}
            />
          );
        }}
      />
    </AuthLayout>
  );
};

export default CompleteProfileScreen;