import React from "react";
import {
  Text,
  View,
} from "react-native";

import { authHeaderStyles as styles } from "../../styles/components/authHeaderStyles";

type Props = {
  title?: string;
  subtitle?: string;
};

const AuthHeader = ({
  title = "CN MASTER",
  subtitle = "Learn • Practice • Grow",
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
};

export default AuthHeader;