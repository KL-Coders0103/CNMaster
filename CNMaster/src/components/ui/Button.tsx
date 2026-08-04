import React from 'react';
import { ActivityIndicator, StyleSheet, Text, Pressable, PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean; 
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  isLoading, 
  disabled, 
  variant = 'primary',
  ...props 
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ 
    transform: [{ scale: scale.value }] 
  }));

  const getBgColor = () => {
    if (variant === 'primary') return theme.colors.primary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'primary') return theme.colors.background;
    return theme.colors.primary;
  };

  const isDisabled = isLoading || disabled;

  return (
    <AnimatedPressable
      onPressIn={() => !isDisabled && (scale.value = withSpring(0.97))}
      onPressOut={() => !isDisabled && (scale.value = withSpring(1))}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        animatedStyle,
        { 
          backgroundColor: getBgColor(),
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: theme.colors.border,
          opacity: isDisabled ? 0.5 : 1, 
        }
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: { height: 48, width: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  text: { fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
});