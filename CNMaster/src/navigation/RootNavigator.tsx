import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';

import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { VerifyEmailScreen } from '../screens/auth/VerifyEmailScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { VerifyResetOTPScreen } from '../screens/auth/VerifyResetOTPScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { CompleteProfileScreen } from '../screens/auth/CompleteProfileScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { NoteReaderScreen } from '@/screens/notes/NoteReaderScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isInitializing, accessToken, user, hasSeenOnboarding } = useAuthStore();

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !accessToken ? (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="VerifyResetOTP" component={VerifyResetOTPScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Group>
      ) : !user?.isProfileCompleted ? (
        <Stack.Group>
          <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="NoteReader" 
            component={NoteReaderScreen} 
            options={{ presentation: 'fullScreenModal' }} 
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};