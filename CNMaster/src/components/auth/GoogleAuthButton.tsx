import React, { useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true, 
});

interface GoogleAuthButtonProps {
  title?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ title = "Continue with Google" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      
      const response = await GoogleSignin.signIn();
      if (response.type === 'success') {
        const idToken = response.data.idToken;

        if (!idToken) throw new Error("Could not retrieve Google ID Token");

        const apiResponse = await api.post('/auth/google', { idToken });

        if (apiResponse.data?.success) {
          setTokens(apiResponse.data.data.accessToken, apiResponse.data.data.refreshToken);
          setUser(apiResponse.data.data.user);
          Toast.show({ type: 'success', text1: 'Logged in successfully!' });
        }
      } 
      else if (response.type === 'cancelled') {
      }

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({ type: 'info', text1: 'Login already in progress' });
      } else {
        Toast.show({ 
          type: 'error', 
          text1: 'Google Auth Failed', 
          text2: error.response?.data?.message || error.message 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      title={title} 
      variant="secondary" 
      onPress={handleGoogleLogin} 
      isLoading={isLoading} 
    />
  );
};