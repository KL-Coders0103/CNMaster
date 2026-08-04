import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { api } from '../../services/api';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const registerSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(100, "Full name cannot exceed 100 characters"),
  email: z.string().trim().email("Invalid email address").transform((email) => email.toLowerCase()),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', data);

      if (response.data?.success) {
        Toast.show({ type: 'success', text1: 'OTP Sent', text2: response.data.message });
        navigation.navigate('VerifyEmail', { email: data.email });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: err.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <AuthHeader title="Create Account" subtitle="Join CN Master today" />
          
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Full Name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.fullName?.message} />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Email Address" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" error={errors.email?.message} />
            )}
          />

          <Controller
            control={control}
            name="mobileNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Mobile Number" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="phone-pad" maxLength={10} error={errors.mobileNumber?.message} />
            )}
          />
          
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Password" value={value} onChangeText={onChange} onBlur={onBlur} isPassword error={errors.password?.message} />
            )}
          />

          <View style={styles.buttonGroup}>
            <Button title="Sign Up" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
            <Button title="Already have an account? Login" variant="ghost" onPress={() => navigation.navigate('Login')} />

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>OR</Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>

            <GoogleAuthButton title="Sign up with Google" />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 32 },
  buttonGroup: { marginTop: 16 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24},
  divider: { flex: 1, height: 1},
  dividerText: { paddingHorizontal: 16, fontSize: 12,fontWeight: '600'},
});