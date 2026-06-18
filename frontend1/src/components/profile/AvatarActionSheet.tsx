import React, { forwardRef, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useThemeStore } from "../../store/themeStore";

type Props = {
  onCamera: () => void;
  onGallery: () => void;
  onRemove: () => void;
};

const AvatarActionSheet = forwardRef<BottomSheetModal, Props>(
  ({ onCamera, onGallery, onRemove }, ref) => {
    const { colors } = useThemeStore();
    const snapPoints = useMemo(() => ["35%"], []);

    // 👈 This creates the dark, clickable overlay behind the modal
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop} // 👈 Added backdrop
        backgroundStyle={{
          backgroundColor: colors.surface,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.border }} // Sleek grabber
      >
        <BottomSheetView style={{ padding: 24, gap: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textPrimary }}>
            Profile Photo
          </Text>

          <TouchableOpacity onPress={onCamera}>
            <Text style={{ fontSize: 16, color: colors.textPrimary }}>📷 Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onGallery}>
            <Text style={{ fontSize: 16, color: colors.textPrimary }}>🖼 Choose From Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onRemove}>
            <Text style={{ fontSize: 16, color: "#EF4444", fontWeight: "600" }}>
              🗑 Remove Avatar
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default AvatarActionSheet;