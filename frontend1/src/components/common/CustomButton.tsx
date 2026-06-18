import React from "react";
import { ActivityIndicator, Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { getCustomButtonStyles } from "../../styles/components/customButtonStyles";
import { useThemeStore } from "../../store/themeStore";

type Props = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: (...args: any[]) => void | Promise<void>;
  style?: StyleProp<ViewStyle>;
};

// 👇 ADDED 'style' HERE
const CustomButton = ({ title, loading = false, disabled = false, onPress, style }: Props) => {
  const { colors } = useThemeStore();
  const styles = getCustomButtonStyles(colors);
  const isDisabled = loading || disabled;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button, 
        style, // Now this will successfully apply!
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
};

export default CustomButton;