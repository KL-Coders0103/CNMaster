import React from "react";
import { Text, View } from "react-native";
import { getAuthHeaderStyles } from "../../styles/components/authHeaderStyles";
import { useThemeStore } from "../../store/themeStore";

type Props = {
  title?: string;
  subtitle?: string;
};

const AuthHeader = ({
  title = "CN MASTER",
  subtitle = "Learn • Practice • Grow",
}: Props) => {
  const { colors } = useThemeStore();
  const styles = getAuthHeaderStyles(colors); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default AuthHeader;