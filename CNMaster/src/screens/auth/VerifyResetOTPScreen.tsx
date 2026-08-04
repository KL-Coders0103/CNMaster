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
import { AuthHeader } from '@/components/auth/AuthHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const verifyOtpSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

type VerifyOtpForm = z.infer<typeof verifyOtpSchema>;

export const VerifyResetOTPScreen = ({ route, navigation }: any) => {
  const { email } = route.params;
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<VerifyOtpForm>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const onSubmit = async (data: VerifyOtpForm) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/verify-forgot-password-otp', { email, otp: data.otp });

      if (response.data?.success) {
        Toast.show({ type: 'success', text1: 'Verified!' });
        navigation.navigate('ResetPassword', { 
          email, 
          resetToken: response.data.data.resetToken 
        });
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <AuthHeader title="Enter Code" subtitle="Enter the 6-digit code sent to {email}" />
          
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
            <Button title="Verify Code" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
            <Button title="Cancel" variant="ghost" onPress={() => navigation.navigate('Login')} />
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