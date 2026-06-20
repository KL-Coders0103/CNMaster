import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useThemeStore } from "../../store/themeStore";
import { getChipStyles } from "../../styles/components/chipStyles";

type Props = {
  title: string;
  selected?: boolean;
  onPress: () => void;
};

const Chip = ({ title, selected, onPress }: Props) => {
  const { colors } = useThemeStore();
  const styles = getChipStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.chip, selected && styles.selectedChip]}
      onPress={onPress}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;