import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { useThemeStore } from "../../store/themeStore";
import { useNotesStore } from "../../store/notesStore";
import SearchBar from "../../components/common/SearchBar";
import Chip from "../../components/common/Chip";
import NoteCard from "../../components/notes/NoteCard";
import { getNotesScreenStyles } from "../../styles/screens/notesScreenStyles";

const NotesScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const styles = getNotesScreenStyles(colors);

  const {
    subjects,
    chapters,
    notes,
    search,
    isLoading,
    selectedSubject,
    selectedChapter,
    fetchSubjects,
    fetchNotes,
    setSearch,
    setSelectedSubject,
    setSelectedChapter,
  } = useNotesStore();

  useEffect(() => {
    fetchSubjects();
    fetchNotes();
  }, []);

  const onRefresh = useCallback(async () => {
    await fetchSubjects();
    await fetchNotes();
  }, [fetchSubjects, fetchNotes]);

  const renderNoteItem = useCallback(
    ({ item }: { item: any }) => (
      <NoteCard
        note={item}
        onPress={() => navigation.navigate("NoteDetail", { noteId: item.id })}
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Feather name="book-open" size={48} color={colors.textMuted} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No Notes Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters.</Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.headerComponentContainer}>
            
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Notes</Text>
                <Text style={styles.subtitle}>Learn smarter with organized notes</Text>
              </View>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => navigation.navigate("DownloadedNotes")}
              >
                <Feather name="download" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <SearchBar
                value={search}
                placeholder="Search notes..."
                onChangeText={setSearch}
              />
            </View>

            {/* Strict Ternary for Subjects */}
            {(subjects && subjects.length > 1) ? (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Subjects</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipScrollContent}
                >
                  {subjects.map((subject) => (
                    <Chip
                      key={subject.id}
                      title={subject.name}
                      selected={selectedSubject === subject.id}
                      onPress={() => setSelectedSubject(subject.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {/* Strict Ternary for Chapters */}
            {(chapters && chapters.length > 0) ? (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Chapters</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipScrollContent}
                >
                  {chapters.map((chapter) => (
                    <Chip
                      key={chapter.id}
                      title={chapter.title}
                      selected={selectedChapter === chapter.id}
                      onPress={() => setSelectedChapter(chapter.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <Text style={[styles.sectionTitle, styles.availableNotesTitle]}>
              Available Notes
            </Text>
          </View>
        }
        renderItem={renderNoteItem}
      />
    </SafeAreaView>
  );
};

export default NotesScreen;