import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ 
        borderLeftColor: '#10B981', 
        height: 75, 
        width: '90%', 
        borderRadius: 12, 
        backgroundColor: '#FFFFFF', 
        elevation: 5, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}
      text2Style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ 
        borderLeftColor: '#EF4444', 
        height: 85, 
        width: '90%', 
        borderRadius: 12, 
        backgroundColor: '#FFFFFF', 
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}
      text2Style={{ fontSize: 14, color: '#EF4444', fontWeight: '500' }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  )
};