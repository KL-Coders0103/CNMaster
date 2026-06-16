import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { getFloatingButtonStyles } from "../../styles/components/floatingActionbuttonStyles";


const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useThemeStore();
  const styles = getFloatingButtonStyles(colors);

  const handleAction = (action: string) => {
    setIsOpen(false);
    console.log(`Maps to: ${action}`);
    // navigation.navigate(action); // We will wire this up when the screens exist
  };

  return (
    <>
      <Modal transparent visible={isOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.menuContainer}>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleAction("CreateNote")}
              activeOpacity={0.8}
            >
              <Text style={styles.menuText}>New Note</Text>
              <View style={[styles.iconContainer, { backgroundColor: colors.isDarkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.1)" }]}>
                <Feather name="file-text" size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleAction("CreateTask")}
              activeOpacity={0.8}
            >
              <Text style={styles.menuText}>New Task</Text>
              <View style={[styles.iconContainer, { backgroundColor: colors.isDarkMode ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.1)" }]}>
                <Feather name="check-square" size={20} color={colors.warning} />
              </View>
            </TouchableOpacity>

          </View>
        </Pressable>
      </Modal>
      
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setIsOpen(true)}
      >
        <Feather name="plus" size={28} color={colors.white} />
      </TouchableOpacity>
    </>
  );
};

export default FloatingActionButton;