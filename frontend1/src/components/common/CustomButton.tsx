import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { getCustomButtonStyles } from "../../styles/components/customButtonStyles";
import { useThemeStore } from "../../store/themeStore";

type Props = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: (...args: any[]) => void | Promise<void>;
};

const CustomButton = ({ title, loading = false, disabled = false, onPress }: Props) => {
  const { colors } = useThemeStore();
  const styles = getCustomButtonStyles(colors);
  const isDisabled = loading || disabled;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
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