import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterScreen from "../screens/auth/RegisterScreen";
import VerifyOtpScreen from "../screens/auth/VerifyOtpScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VerifyForgotOtpScreen from "../screens/auth/VerifyForgotOtpScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

export type AuthStackParamList = {
  Register: undefined;

  VerifyOtp: {
    email: string;
  };

  CompleteProfile: undefined;

  Login: undefined;

  ForgotPassword: undefined;

  VerifyForgotOtp: {
    email: string;
  };

  ResetPassword: {
    email: string;
    otp: string;
  };
};

type Props = {
  initialRouteName?: keyof AuthStackParamList;
};

const Stack =
  createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = ({
  initialRouteName = "Register",
}: Props) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtpScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfileScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="VerifyForgotOtp"
        component={VerifyForgotOtpScreen}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;