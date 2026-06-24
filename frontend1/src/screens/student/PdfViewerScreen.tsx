import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Pdf from "react-native-pdf";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { NotesStackParamList } from "../../navigation/NotesStackNavigator";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { getReadingProgress, saveReadingProgress } from "../../services/notesService";

type Props = NativeStackScreenProps<NotesStackParamList, "PdfViewer">;

const PdfViewerScreen = ({ route, navigation }: Props) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const { noteId, pdfUrl, title } = route.params;

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [initialPage, setInitialPage] = useState(1);

  const isLocalFile = pdfUrl.startsWith("file://") || pdfUrl.startsWith("/");

  useEffect(() => {
    loadReadingProgress();
  }, []);

  const loadReadingProgress = async () => {
  try {
    const response = await getReadingProgress(noteId);
    if (response.data?.currentPage) {
      setInitialPage(response.data.currentPage);
      setPage(response.data.currentPage);
    }
  } catch (error) {
    console.log("No previous progress found");
  } finally {
    setProgressLoaded(true);
  }
};

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.headerTitle}>
          {title}
        </Text>
        
        <View style={{ width: 40 }} />
      </View>

      {loading || !progressLoaded ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}

      {progressLoaded && (
        <Pdf
          page={initialPage}
          trustAllCerts={false}
          source={{ 
            uri: pdfUrl, 
            cache: !isLocalFile 
          }}
          onLoadComplete={(numberOfPages) => {
            setPages(numberOfPages);
            setLoading(false);
          }}
          onPageChanged={async (currentPage) => {
            setPage(currentPage);
            try {
              await saveReadingProgress(noteId, currentPage, pages);
            } catch (error) {
              console.log("Progress save failed");
            }
          }}
          onError={(error) => {
            console.log("PDF Error: ", error);
            setLoading(false);
          }}
          style={styles.pdfContainer}
        />
      )}

      {(!loading && pages > 0) ? (
        <View style={styles.floatingBadge}>
          <Text style={styles.floatingBadgeText}>
            {page} / {pages}
          </Text>
        </View>
      ) : null}

    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.background },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center" },
    headerTitle: { flex: 1, marginHorizontal: 16, fontSize: 16, fontWeight: "700", color: colors.textPrimary, textAlign: "center" },
    loadingOverlay: { ...StyleSheet.absoluteFill, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, zIndex: 10 },
    pdfContainer: { flex: 1, backgroundColor: colors.surface },
    floatingBadge: { position: "absolute", bottom: 30, alignSelf: "center", backgroundColor: colors.surface, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
    floatingBadgeText: { color: colors.textPrimary, fontSize: 14, fontWeight: "700", letterSpacing: 0.5 },
  });

export default PdfViewerScreen;