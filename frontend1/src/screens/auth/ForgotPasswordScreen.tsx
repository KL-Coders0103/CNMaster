import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AuthLayout from "../../components/common/AuthLayout";
import CustomInput from "../../components/common/CustomInput";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../../utils/forgotPasswordSchema";
import { forgotPassword } from "../../services/authService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword({ email: data.email.trim().toLowerCase() });
      Toast.show({ type: "success", text1: "OTP Sent", text2: response.message });
      navigation.navigate("VerifyForgotOtp", { email: data.email });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Failed", text2: error?.response?.data?.message ?? "Something went wrong" });
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Don't worry. Enter your registered email and we'll send you an OTP."
      buttonTitle="Send OTP"
      onButtonPress={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      bottomText="← Back to"
      bottomLinkText="Login"
      onBottomLinkPress={() => navigation.goBack()}
    >
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <CustomInput label="Email" placeholder="Enter your email" value={field.value} onChangeText={field.onChange} autoCapitalize="none" keyboardType="email-address" error={errors.email?.message} />
        )}
      />
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;