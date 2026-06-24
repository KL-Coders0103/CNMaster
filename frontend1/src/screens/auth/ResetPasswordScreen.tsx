import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AuthLayout from "../../components/common/AuthLayout";
import CustomInput from "../../components/common/CustomInput";
// CRITICAL FIX: Make sure you rename this file in your IDE to fix the "Strenght" typo!
import PasswordStrengthIndicator from "../../components/common/PasswordStrenghtIndicator"; 

import { resetPasswordSchema, ResetPasswordFormData } from "../../utils/resetPasswordSchema";
import { resetPassword } from "../../services/authService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

const ResetPasswordScreen = ({ navigation, route }: Props) => {
  const { email, otp } = route.params;

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await resetPassword({ email, otp, password: data.password });
      Toast.show({ type: "success", text1: "Password Reset", text2: response.message });
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Failed", text2: error?.response?.data?.message ?? "Something went wrong" });
    }
  };

  return (
    <AuthLayout
      title="Create a new password"
      subtitle="Your new password should be strong and different from previous passwords."
      buttonTitle="Reset Password"
      onButtonPress={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <>
            <CustomInput 
              label="New Password" 
              placeholder="Enter password" 
              value={field.value} 
              onChangeText={field.onChange} 
              isPassword 
              error={errors.password?.message} 
            />
            {/* UX FIX: Aligned with RegisterScreen to hide when empty */}
            {field.value.length > 0 && (
              <PasswordStrengthIndicator password={field.value} />
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <CustomInput 
            label="Confirm Password" 
            placeholder="Confirm password" 
            value={field.value} 
            onChangeText={field.onChange} 
            isPassword 
            error={errors.confirmPassword?.message} 
          />
        )}
      />
    </AuthLayout>
  );
};

export default ResetPasswordScreen;