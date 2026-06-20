import React from "react";
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { getSearchBarStyles } from "../../styles/components/searchBarStyle";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBar = ({ value, onChangeText, placeholder }: Props) => {
  const { colors } = useThemeStore();
  const styles = getSearchBarStyles(colors);

  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? "Search"}
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
};

export default SearchBar;