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

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordScreen = ({ route, navigation }: any) => {
  const { email, resetToken } = route.params;
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/reset-password', { 
        email, 
        resetToken, 
        password: data.password 
      });

      if (response.data?.success) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Password has been reset' });
        navigation.navigate('Login');
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to reset',
        text2: err.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <AuthHeader title="New Password" subtitle="Create a strong, secure password" />
          
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input 
                label="New Password" 
                value={value} 
                onChangeText={onChange} 
                onBlur={onBlur} 
                isPassword 
                error={errors.password?.message} 
              />
            )}
          />

          <View style={styles.buttonGroup}>
            <Button title="Update Password" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
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