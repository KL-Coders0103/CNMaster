import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Pressable } from "react-native"; // CRITICAL FIX: Imported Pressable
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

type Props = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
};

const CustomDropdown = ({ label, value, options, onSelect, placeholder, error }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const { colors } = useThemeStore();
  const styles = createThemedStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.inputBox, error && styles.errorBorder]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Feather name={isVisible ? "chevron-up" : "chevron-down"} size={20} color={colors.placeholder} />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setIsVisible(false)} 
          activeOpacity={1}
        >
          {/* CRITICAL FIX: Wrapped the menu in a Pressable to stop touches from bubbling up to the overlay */}
          <Pressable style={styles.dropdownMenu}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Feather name="x" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, value === item && styles.selectedOption]}
                  onPress={() => {
                    onSelect(item);
                    setIsVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, value === item && styles.selectedOptionText]}>
                    {item}
                  </Text>
                  {value === item && <Feather name="check" size={18} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};


const createThemedStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    height: 54, 
  },
  errorBorder: {
    borderColor: colors.error,
  },
  inputText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  placeholderText: {
    color: colors.placeholder,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    justifyContent: "flex-end", 
  },
  dropdownMenu: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    maxHeight: "60%", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  selectedOption: {
    backgroundColor: colors.isDarkMode ? "rgba(99, 102, 241, 0.15)" : "#EFF6FF",
    paddingHorizontal: 16,
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: "800",
  },
});

export default CustomDropdown;