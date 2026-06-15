import React, { useState } from "react";
import { Text, TextInput, View, TextInputProps, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { customInputStyles as styles } from "../../styles/components/customInputStyles";

type Props = TextInputProps & {
  label: string;
  error?: string;
  prefix?: string;
  isPassword?: boolean;
};

const CustomInput = ({ label, error, prefix, isPassword, ...props }: Props) => {
  const [isSecure, setIsSecure] = useState(true); 

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View 
        style={[
          styles.input, 
          // 👇 Changed paddingRight to 12 so the icon hugs the edge!
          { flexDirection: "row", alignItems: "center", paddingLeft: 16, paddingRight: 12 },
          error && styles.errorInput
        ]}
      >
        {prefix && (
          <Text style={{ color: "#1E293B", fontWeight: "600", fontSize: 16, marginRight: 8 }}>
            {prefix}
          </Text>
        )}
        
        <TextInput
          {...props}
          secureTextEntry={isPassword ? isSecure : props.secureTextEntry}
          placeholderTextColor="#94A3B8"
          style={{
            flex: 1,
            height: "100%",
            fontSize: 16,
            color: "#1E293B",
            paddingVertical: 0, 
          }}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={{ paddingLeft: 8 }}>
            <Feather 
              name={isSecure ? "eye-off" : "eye"} 
              size={20} 
              color="#94A3B8" 
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;