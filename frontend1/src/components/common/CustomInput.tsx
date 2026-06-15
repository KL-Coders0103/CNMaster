import React from "react";
import {
  Text,
  TextInput,
  View,
  TextInputProps,
  TouchableOpacity,
} from "react-native";

import { customInputStyles as styles } from "../../styles/components/customInputStyles";

type Props = TextInputProps & {
  label: string;
  error?: string;
  rightText?: string;
  onRightPress?: () => void;
};

const CustomInput = ({
  label,
  error,
  rightText,
  onRightPress,
  ...props
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          placeholderTextColor="#94A3B8"
          style={[
            styles.input,
            error && styles.errorInput,
          ]}
        />

        {rightText && (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.rightButton}
          >
            <Text style={styles.rightText}>
              {rightText}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;