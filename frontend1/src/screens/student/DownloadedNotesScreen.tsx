import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";

import { useDownloadedNotesStore } from "../../store/downloadedNotesStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const DownloadedNotesScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const {
    notes,
    loadDownloadedNotes,
    removeDownloadedNote,
  } = useDownloadedNotesStore();

  useEffect(() => {
    loadDownloadedNotes();
  }, []);

  const handleDelete = async (noteId: string, localUri: string) => {
    try {
      await FileSystem.deleteAsync(localUri, { idempotent: true });
      await removeDownloadedNote(noteId);
    } catch (error) {
      console.log(error);
    }
  };

  // Performance Optimization: Extract renderItem
  const renderNoteItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() =>
          navigation.navigate("PdfViewer", {
            noteId: item.noteId,
            pdfUrl: item.localUri,
            title: item.title,
          })
        }
      >
        <View style={styles.cardContent}>
          <View style={styles.pdfBadge}>
            <Feather name="file-text" size={22} color={colors.primary} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.subtitle}>Available Offline</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.noteId, item.localUri)}
          >
            <Feather name="trash-2" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ),
    [navigation, colors]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.header}>Offline Notes</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center the title */}
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.noteId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="download-cloud" size={48} color={colors.textMuted || "rgba(0,0,0,0.2)"} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No Downloaded Notes</Text>
            <Text style={styles.emptySubtitle}>Download notes to study offline</Text>
          </View>
        }
        renderItem={renderNoteItem}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
      flexGrow: 1,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24, // Synced with NoteCard
      padding: 18,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    pdfBadge: {
      width: 52, // Synced with NoteCard
      height: 52,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(37,99,235,0.1)",
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    deleteButton: {
      padding: 8,
      backgroundColor: "rgba(239, 68, 68, 0.1)", // Soft red background
      borderRadius: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 80,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    emptySubtitle: {
      marginTop: 6,
      color: colors.textSecondary,
      fontSize: 14,
    },
  });

export default DownloadedNotesScreen;