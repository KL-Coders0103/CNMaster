import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { NotesStackParamList } from "../../navigation/NotesStackNavigator";
import { getNoteDetails, registerDownload, toggleBookmark } from "../../services/notesService";
import { NoteDetail } from "../../types/notes";
import { useThemeStore } from "../../store/themeStore";
import { downloadNote } from "../../utils/noteDownload";
import { useDownloadedNotesStore } from "../../store/downloadedNotesStore";
import { ThemePalette } from "../../theme/colors";

type Props = NativeStackScreenProps<NotesStackParamList, "NoteDetail">;

const NoteDetailScreen = ({ route, navigation }: Props) => {
  const { noteId } = route.params;
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<NoteDetail | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const addDownloadedNote = useDownloadedNotesStore((state) => state.addDownloadedNote);

  useEffect(() => {
    loadNote();
  }, []);

  const loadNote = async () => {
    try {
      const response = await getNoteDetails(noteId);
      setNote(response.data);
    } finally {
      setLoading(false);
    }
  };

  const onBookmarkPress = async () => {
    if (!note) return;
    try {
      setBookmarkLoading(true);
      await toggleBookmark(note.id, note.isBookmarked);
      setNote({ ...note, isBookmarked: !note.isBookmarked });
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!note) return;
    try {
      setDownloading(true);
      const result = await downloadNote(
        note.id, note.title, note.pdfUrl, (progress) => setDownloadProgress(progress)
      );

      await addDownloadedNote({
        noteId: note.id,
        title: note.title,
        localUri: result.uri,
        downloadedAt: new Date().toISOString(),
      });

      await registerDownload(note.id);
      Toast.show({ type: "success", text1: "Downloaded Successfully" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Download failed" });
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!note) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onBookmarkPress} disabled={bookmarkLoading} style={styles.iconButton}>
            <Feather 
              name="bookmark" 
              size={24} 
              color={note.isBookmarked ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Note Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.iconBox}>
            <Feather name="file-text" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.description}>{note.description}</Text>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}><Text style={styles.tagText}>{note.subject}</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>{note.chapter}</Text></View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Views</Text>
            <Text style={styles.statValue}>{note.views}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Downloads</Text>
            <Text style={styles.statValue}>{note.downloads}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("PdfViewer", { noteId: note.id, pdfUrl: note.pdfUrl, title: note.title })}
        >
          <Text style={styles.primaryButtonText}>Read Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, downloading && { opacity: 0.7 }]}
          onPress={handleDownload}
          disabled={downloading}
        >
          <Text style={styles.secondaryButtonText}>
            {downloading ? `Downloading ${downloadProgress}%` : "Download For Offline"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  iconButton: { padding: 8, backgroundColor: colors.surface, borderRadius: 12 },
  infoCard: { backgroundColor: colors.surface, borderRadius: 28, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  iconBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: "rgba(37,99,235,0.1)", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "800", color: colors.textPrimary },
  description: { color: colors.textSecondary, marginTop: 12, lineHeight: 24, fontSize: 15 },
  tagsContainer: { flexDirection: "row", marginTop: 24, flexWrap: "wrap", gap: 10 },
  tag: { backgroundColor: colors.background, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  tagText: { color: colors.textSecondary, fontWeight: "600", fontSize: 13 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, gap: 16 },
  statBox: { flex: 1, backgroundColor: colors.surface, borderRadius: 24, padding: 20 },
  statLabel: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
  statValue: { fontSize: 24, fontWeight: "800", color: colors.textPrimary, marginTop: 8 },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 20, padding: 18, alignItems: "center", marginTop: 32, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryButton: { borderWidth: 2, borderColor: colors.border, borderRadius: 20, padding: 18, alignItems: "center", marginTop: 16 },
  secondaryButtonText: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
});

export default NoteDetailScreen;