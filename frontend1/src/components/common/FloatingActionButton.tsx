import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable, Animated, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeStore } from "../../store/themeStore";
import { usePlannerStore } from "../../store/plannerStore";
import { ThemePalette } from "../../theme/colors";

const FloatingActionButton = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();
  const setOpenAddTaskModel = usePlannerStore(state => state.setOpenAddTaskModal);

  const [mounted, setMounted] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (mounted) {
      closeMenu();
    } else {
      setMounted(true);
      Animated.spring(animation, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeMenu = (callback?: () => void) => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setMounted(false);
      if (callback) callback();
    });
  };

  const handleAction = (action: string) => {
    closeMenu(() => {
      if (action === "CreateTask") {
        setOpenAddTaskModel(true);
        navigation.navigate("Planner");
      } else if (action === "CreateNote") {
        navigation.navigate("Notes");
      }
    });
  };

  // 🌀 Animation Interpolations
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const overlayOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const taskTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const noteTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  return (
    <>
      {/* 🟢 Base FAB (Visible when menu is closed) */}
      {!mounted && (
        <Animated.View style={[styles.fabWrapper, { transform: [{ rotate: rotation }] }]}>
          <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={toggleMenu}>
            <Feather name="plus" size={28} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* 🟢 Interactive Menu Modal */}
      <Modal transparent visible={mounted} animationType="none">
        
        {/* Animated Dark Backdrop */}
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeMenu()} />
        </Animated.View>

        {/* Menu Items Container */}
        <View style={styles.menuContainer} pointerEvents="box-none">
          
          {/* New Note Action */}
          <Animated.View style={[styles.menuItemRow, { opacity: overlayOpacity, transform: [{ translateY: noteTranslateY }] }]}>
            <TouchableOpacity 
              style={styles.menuItemBody} 
              onPress={() => handleAction("CreateNote")}
              activeOpacity={0.8}
            >
              <View style={styles.menuLabel}>
                <Text style={styles.menuText}>New Note</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: "rgba(99, 102, 241, 0.15)" }]}>
                <Feather name="file-text" size={20} color="#6366f1" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* New Task Action */}
          <Animated.View style={[styles.menuItemRow, { opacity: overlayOpacity, transform: [{ translateY: taskTranslateY }] }]}>
            <TouchableOpacity 
              style={styles.menuItemBody} 
              onPress={() => handleAction("CreateTask")}
              activeOpacity={0.8}
            >
              <View style={styles.menuLabel}>
                <Text style={styles.menuText}>New Task</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                <Feather name="check-square" size={20} color="#F59E0B" />
              </View>
            </TouchableOpacity>
          </Animated.View>

        </View>

        {/* 🟢 Overlaid FAB (To close the menu natively) */}
        <Animated.View style={[styles.fabWrapper, { transform: [{ rotate: rotation }] }]}>
          <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => closeMenu()}>
            <Feather name="plus" size={28} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
        
      </Modal>
    </>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  fabWrapper: {
    position: "absolute",
    bottom: 24,
    right: 20,
    zIndex: 999,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  menuContainer: {
    position: "absolute",
    bottom: 100, // Distance above the FAB
    right: 24,
    alignItems: "flex-end",
    gap: 16,
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  menuItemBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuLabel: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: colors.surface, // fallback
  },
});

export default FloatingActionButton;