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

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address").transform((email) => email.toLowerCase()),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/forgot-password', data);

      if (response.data?.success) {
        Toast.show({ type: 'success', text1: 'OTP Sent', text2: response.data.message });
        navigation.navigate('VerifyResetOTP', { email: data.email });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Failed to process request',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <AuthHeader title="Reset Password" subtitle="Enter your email to receive a reset code" />
          
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input 
                label="Email Address" 
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />

          <View style={styles.buttonGroup}>
            <Button title="Send Reset Code" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
            <Button title="Back to Login" variant="ghost" onPress={() => navigation.goBack()} />
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