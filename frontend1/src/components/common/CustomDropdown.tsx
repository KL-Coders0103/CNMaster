import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* The visible input box */}
      <TouchableOpacity
        style={[styles.inputBox, error && styles.errorBorder]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Feather name={isVisible ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* The beautiful overlay menu */}
      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setIsVisible(false)} 
          activeOpacity={1}
        >
          <View style={styles.dropdownMenu}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Feather name="x" size={20} color="#64748B" />
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
                  {value === item && <Feather name="check" size={18} color="#2563EB" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    height: 52, // Matches the standard text input height
  },
  errorBorder: {
    borderColor: "#EF4444",
  },
  inputText: {
    fontSize: 16,
    color: "#1E293B",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)", // Sleek dark overlay
    justifyContent: "flex-end", // Pushes the menu to the bottom
  },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    maxHeight: "60%", // Ensures it doesn't take up the whole screen
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  selectedOption: {
    backgroundColor: "#EFF6FF", // Light blue highlight
    paddingHorizontal: 12,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#2563EB",
    fontWeight: "700",
  },
});

export default CustomDropdown;