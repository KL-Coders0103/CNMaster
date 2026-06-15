import React from "react";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/common/AuthLayout";
import CustomInput from "../../components/common/CustomInput";
import PasswordStrengthIndicator from "../../components/common/PasswordStrenghtIndicator";
import { registerSchema, RegisterFormData } from "../../utils/registerSchema";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { registerUser } from "../../services/authService";
import { signInWithGoogle } from "../../services/googleAuthService";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  // Notice: No more useState for passwords here!

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", mobileNumber: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser({
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        mobileNumber: data.mobileNumber.trim(),
        password: data.password,
      });
      Toast.show({ type: "success", text1: "Registration Successful", text2: response.message || "OTP sent successfully" });
      navigation.navigate("VerifyOtp", { email: data.email });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Registration Failed", text2: error?.response?.data?.message || "Something went wrong" });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const user = await signInWithGoogle();
      if (!user) return;
      Toast.show({ type: "success", text1: "Google Sign In Successful" });
      if (!user.isProfileCompleted) navigation.navigate("CompleteProfile");
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Google Sign In Failed", text2: error?.message ?? "Something went wrong" });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start mastering Computer Networks with interactive learning experiences."
      buttonTitle="Create Account"
      onButtonPress={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      showGoogleAuth={true}
      onGooglePress={handleGoogleSignUp}
      bottomText="Already have an account?"
      bottomLinkText="Login"
      onBottomLinkPress={() => navigation.navigate("Login")}
    >
      <Controller control={control} name="fullName" render={({ field }) => <CustomInput label="Full Name" placeholder="Enter full name" value={field.value} onChangeText={field.onChange} error={errors.fullName?.message} />} />
      <Controller control={control} name="email" render={({ field }) => <CustomInput label="Email" placeholder="Enter email" value={field.value} onChangeText={field.onChange} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />} />
      <Controller control={control} name="mobileNumber" render={({ field }) => <CustomInput label="Mobile Number" placeholder="Enter mobile number" prefix="+91" value={field.value} onChangeText={field.onChange} keyboardType="phone-pad" maxLength={10} error={errors.mobileNumber?.message} />} />
      
      <Controller control={control} name="password" render={({ field }) => (
        <>
          <CustomInput label="Password" placeholder="Create password" value={field.value} onChangeText={field.onChange} isPassword error={errors.password?.message} />
          <PasswordStrengthIndicator password={field.value} />
        </>
      )} />
      
      <Controller control={control} name="confirmPassword" render={({ field }) => <CustomInput label="Confirm Password" placeholder="Confirm password" value={field.value} onChangeText={field.onChange} isPassword error={errors.confirmPassword?.message} />} />
    </AuthLayout>
  );
};

export default RegisterScreen;