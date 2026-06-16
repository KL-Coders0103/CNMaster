import React from "react";
import { Text, View } from "react-native";
import { useThemeStore } from "../../store/themeStore";

type Props = {
  password: string;
};

const PasswordStrengthIndicator = ({ password }: Props) => {
  const { colors } = useThemeStore(); // 👈 Grab dynamic colors
  
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  
  // 👈 Replace static colors with theme colors
  const strengthColors = [colors.error, colors.warning, colors.primary, colors.success];

  if (password.length === 0) return null;

  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              backgroundColor: index < strength ? strengthColors[strength - 1] : colors.border,
            }}
          />
        ))}
      </View>

      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          color: strengthColors[strength - 1] ?? colors.textSecondary,
          fontWeight: "600",
        }}
      >
        {labels[strength - 1] ?? ""}
      </Text>
    </View>
  );
};

export default PasswordStrengthIndicator;