import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
} from "react-native";

import { COLORS } from "../theme/colors";
import { customButtonStyles as styles } from "../styles/components/customButtonStyles";

type Props = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: (...args: any[]) => void | Promise<void>;
};

const CustomButton = ({
  title,
  loading = false,
  disabled = false,
  onPress,
}: Props) => {
  const isDisabled = loading || disabled;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed &&
          !isDisabled &&
          styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={COLORS.white}
        />
      ) : (
        <Text style={styles.text}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;