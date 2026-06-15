import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AuthLayout from "../../components/common/AuthLayout";
import CustomInput from "../../components/common/CustomInput";
import { loginSchema, LoginFormData } from "../../utils/loginSchema";
import { loginUser } from "../../services/authService";
import { saveTokens } from "../../utils/secureStorage";
import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { signInWithGoogle } from "../../services/googleAuthService";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen = ({ navigation }: Props) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data);
      await saveTokens(response.data.accessToken, response.data.refreshToken, response.data.user);
      setAuth(response.data.accessToken, response.data.refreshToken, response.data.user);
      Toast.show({ type: "success", text1: "Welcome Back", text2: response.message });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Login Failed", text2: error?.response?.data?.message ?? "Something went wrong" });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (!user) return;
      Toast.show({ type: "success", text1: "Google Login Successful" });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Google Login Failed", text2: error?.message ?? "Something went wrong" });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue your learning journey and master Computer Networks."
      buttonTitle="Sign In"
      onButtonPress={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      showForgotPassword={true}
      onForgotPasswordPress={() => navigation.navigate("ForgotPassword")}
      showGoogleAuth={true}
      onGooglePress={handleGoogleSignIn}
      bottomText="Don't have an account?"
      bottomLinkText="Register"
      onBottomLinkPress={() => navigation.navigate("Register")}
    >
      <Controller
        control={control}
        name="identifier"
        render={({ field }) => (
          <CustomInput label="Email or Mobile" placeholder="Enter email or mobile" value={field.value} onChangeText={field.onChange} autoCapitalize="none" error={errors.identifier?.message} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <CustomInput 
            label="Password" 
            placeholder="Enter password" 
            value={field.value} 
            onChangeText={field.onChange} 
            error={errors.password?.message}
            isPassword
          />
        )}
      />
    </AuthLayout>
  );
};

export default LoginScreen;