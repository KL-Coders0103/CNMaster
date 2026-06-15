import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

import AuthLayout from "../../components/common/AuthLayout";
import OtpInput from "../../components/common/OtpInput";
import { verifyForgotOtpSchema, VerifyForgotOtpFormData } from "../../utils/verifyForgotOtpSchema";
import { forgotPassword, verifyForgotOtp } from "../../services/authService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyForgotOtp">;

const VerifyForgotOtpScreen = ({ navigation, route }: Props) => {
  const { email } = route.params;
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<VerifyForgotOtpFormData>({
    resolver: zodResolver(verifyForgotOtpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data: VerifyForgotOtpFormData) => {
    try {
      const response = await verifyForgotOtp({ email, otp: data.otp });
      Toast.show({ type: "success", text1: "OTP Verified", text2: response.message });
      navigation.navigate("ResetPassword", { email, otp: data.otp });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Verification Failed", text2: error?.response?.data?.message ?? "Something went wrong" });
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      const response = await forgotPassword({ email });
      Toast.show({ type: "success", text1: "OTP Sent", text2: response.message });
      setCountdown(30);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Failed", text2: error?.response?.data?.message ?? "Something went wrong" });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the OTP sent to your email"
      buttonTitle="Verify OTP"
      onButtonPress={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <Text style={{ fontSize: 16, color: "#1E293B", fontWeight: "600" }}>{email}</Text>
      </View>

      <Controller
        control={control}
        name="otp"
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={(otp) => {
              field.onChange(otp);
              if (otp.length === 6) handleSubmit(onSubmit)();
            }}
          />
        )}
      />

      <TouchableOpacity disabled={countdown > 0 || isResending} onPress={handleResend} style={{ alignItems: "center", marginTop: 24 }}>
        <Text style={{ color: countdown > 0 ? "#94A3B8" : "#2563EB", fontWeight: "600" }}>
          {countdown > 0 ? `Resend OTP in ${countdown}s` : isResending ? "Sending..." : "Resend OTP"}
        </Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default VerifyForgotOtpScreen;