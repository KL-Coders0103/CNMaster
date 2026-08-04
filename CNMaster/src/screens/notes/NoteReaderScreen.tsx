import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, Download } from 'lucide-react-native';
import Pdf from 'react-native-pdf';
import { documentDirectory, getInfoAsync, downloadAsync } from 'expo-file-system/legacy';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '../../theme/ThemeProvider';
import { useNotesStore } from '../../store/useNotesStore';

export const NoteReaderScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  
  const { noteId } = route.params as { noteId: string };

  const { 
    currentNote, currentProgress, isReaderLoading, 
    fetchNoteDetails, saveProgress, toggleBookmark, recordDownload, clearCurrentNote 
  } = useNotesStore();

  const [pdfError, setPdfError] = useState(false);
  const [localPdfPath, setLocalPdfPath] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchNoteDetails(noteId);
    return () => clearCurrentNote();
  }, [noteId]);

  useEffect(() => {
    if (!currentNote?.pdfUrl) return;

    let isMounted = true;
    const downloadPdf = async () => {
      setIsDownloading(true);
      try {
        const fileUri = `${documentDirectory}cn_master_note_${currentNote.id}.pdf`;
        const fileInfo = await getInfoAsync(fileUri);
        
        if (fileInfo.exists) {
          if (isMounted) setLocalPdfPath(fileUri);
          return;
        }

        const downloadRes = await downloadAsync(
          currentNote.pdfUrl,
          fileUri
        );

        if (isMounted && downloadRes?.uri) {
          setLocalPdfPath(downloadRes.uri);
        }
      } catch (error) {
        console.error("FileSystem Download Error:", error);
        if (isMounted) setPdfError(true);
      } finally {
        if (isMounted) setIsDownloading(false);
      }
    };

    downloadPdf();

    return () => { isMounted = false; };
  }, [currentNote?.pdfUrl]);

  if (isReaderLoading || !currentNote || isDownloading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            {isDownloading ? "Downloading securely..." : "Loading document..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerChapter, { color: theme.colors.primary }]}>{currentNote.chapter}</Text>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {currentNote.title}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => toggleBookmark(currentNote.id)}>
            <Bookmark 
              size={22} 
              color={currentNote.isBookmarked ? theme.colors.primary : theme.colors.text} 
              fill={currentNote.isBookmarked ? theme.colors.primary : 'transparent'} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => recordDownload(currentNote.id)}>
            <Download size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {pdfError || !localPdfPath ? (
        <View style={styles.center}>
          <Text style={{ color: theme.colors.error, marginBottom: 8 }}>Failed to load PDF.</Text>
        </View>
      ) : (
        <Pdf
          source={{ uri: localPdfPath }}
          page={currentProgress?.currentPage || 1}
          trustAllCerts={false} 
          onLoadComplete={(numberOfPages) => {
            if (!currentProgress) saveProgress(currentNote.id, 1, numberOfPages);
          }}
          onPageChanged={(page, numberOfPages) => {
            saveProgress(currentNote.id, page, numberOfPages);
          }}
          onError={(error) => {
            console.log("Local PDF Render Error:", error);
            setPdfError(true);
          }}
          style={styles.pdf}
        />
      )}

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          Page {currentProgress?.currentPage || 1} of {currentProgress?.totalPages || '?'}
        </Text>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 14, fontWeight: '500' },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderWidth: 0, borderBottomWidth: 1 },
  iconBtn: { padding: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, marginHorizontal: 12 },
  headerChapter: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 4 },

  pdf: { flex: 1, backgroundColor: 'transparent' },

  footer: { paddingVertical: 12, alignItems: 'center', borderTopWidth: 1 },
  progressText: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
});