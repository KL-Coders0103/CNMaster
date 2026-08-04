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
import { useAuthStore } from '../../store/useAuthStore';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const createProfileSchema = (isGoogleAuth: boolean) => z.object({
  year: z.string().trim().min(1, "Year is required"),
  branch: z.string().trim().min(1, "Branch is required"),
  section: z.string().trim().min(1, "Section is required"),
  mobileNumber: isGoogleAuth 
    ? z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    : z.string().optional(),
  password: isGoogleAuth
    ? z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
    : z.string().optional(),
});

type CompleteProfileForm = z.infer<ReturnType<typeof createProfileSchema>>;

export const CompleteProfileScreen = () => {
  const { theme } = useTheme();
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const isGoogleAuth = !user?.mobileNumber;
  const schema = createProfileSchema(isGoogleAuth);

  const { control, handleSubmit, formState: { errors } } = useForm<CompleteProfileForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: CompleteProfileForm) => {
    try {
      setIsLoading(true);
      const payload = {
        year: data.year,
        branch: data.branch,
        section: data.section,
        ...(isGoogleAuth && { mobileNumber: data.mobileNumber, password: data.password })
      };

      const response = await api.patch('/auth/complete-profile', payload);

      if (response.data?.success) {
        Toast.show({ type: 'success', text1: 'Profile Completed!' });
        setUser(response.data.data.user);
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err.response?.data?.message || 'Please check your inputs',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <AuthHeader title="Almost there!" subtitle="We need a few more details to set up your account." />
          
          <Controller
            control={control}
            name="year"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Year" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.year?.message} placeholder="e.g., 3rd Year" />
            )}
          />

          <Controller
            control={control}
            name="branch"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Branch" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.branch?.message} placeholder="e.g., Computer Science" />
            )}
          />

          <Controller
            control={control}
            name="section"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Section" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.section?.message} placeholder="e.g., A" />
            )}
          />

          {isGoogleAuth && (
            <>
              <View style={styles.divider} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account Security</Text>
              
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
                  <Input label="Set Password" value={value} onChangeText={onChange} onBlur={onBlur} isPassword error={errors.password?.message} />
                )}
              />
            </>
          )}

          <View style={styles.buttonGroup}>
            <Button title="Complete Profile" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
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
  subtitle: { fontSize: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, marginTop: 8 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },
  buttonGroup: { marginTop: 24 }
});