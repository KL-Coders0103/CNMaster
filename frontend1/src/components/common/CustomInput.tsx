import React, { useState } from "react";
import { Text, TextInput, View, TextInputProps, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getCustomInputStyles } from "../../styles/components/customInputStyles";
import { useThemeStore } from "../../store/themeStore";

type Props = TextInputProps & {
  label: string;
  error?: string;
  prefix?: string;
  isPassword?: boolean;
};

const CustomInput = ({ label, error, prefix, isPassword, ...props }: Props) => {
  const [isSecure, setIsSecure] = useState(true); 
  const { colors } = useThemeStore();
  const styles = getCustomInputStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View 
        style={[
          styles.input, 
          { flexDirection: "row", alignItems: "center", paddingLeft: 16, paddingRight: 12 },
          error && styles.errorInput
        ]}
      >
        {prefix && (
          <Text style={{ color: colors.textPrimary, fontWeight: "600", fontSize: 16, marginRight: 8 }}>
            {prefix}
          </Text>
        )}
        
        <TextInput
          {...props}
          secureTextEntry={isPassword ? isSecure : props.secureTextEntry}
          placeholderTextColor={colors.placeholder}
          style={{
            flex: 1,
            height: "100%",
            fontSize: 16,
            color: colors.textPrimary,
            paddingVertical: 0, 
          }}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={{ paddingLeft: 8 }}>
            <Feather 
              name={isSecure ? "eye-off" : "eye"} 
              size={20} 
              color={colors.placeholder} 
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;