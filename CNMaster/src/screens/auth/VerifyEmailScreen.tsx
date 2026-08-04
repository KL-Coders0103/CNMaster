import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const verifyEmailSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

export const VerifyEmailScreen = ({ route, navigation }: any) => {
  const { email } = route.params; 
  
  const { theme } = useTheme();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = async (data: VerifyEmailForm) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/verify-email', { email, otp: data.otp });

      if (response.data?.success) {
        setTokens(response.data.data.accessToken, response.data.data.refreshToken);
        setUser(response.data.data.user);
        Toast.show({ type: 'success', text1: 'Verified!', text2: response.data.message });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: err.response?.data?.message || 'Invalid OTP',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const response = await api.post('/auth/resend-otp', { email });
      if (response.data?.success) {
        Toast.show({ type: 'info', text1: 'OTP Resent', text2: 'Please check your email.' });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Could not resend OTP',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <AuthHeader title="Verify Email" subtitle="We sent a 6-digit code to {email}" />
          
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input 
                label="6-Digit OTP" 
                value={value} 
                onChangeText={onChange} 
                onBlur={onBlur} 
                keyboardType="number-pad" 
                maxLength={6} 
                error={errors.otp?.message} 
              />
            )}
          />

          <View style={styles.buttonGroup}>
            <Button title="Verify OTP" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
            <Button 
              title="Resend Code" 
              variant="secondary" 
              onPress={handleResendOtp} 
              isLoading={isResending} 
            />
            <Button 
              title="Back to Login" 
              variant="ghost" 
              onPress={() => navigation.navigate('Login')} 
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 32 },
  buttonGroup: { marginTop: 16 }
});