import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Search, FileText, Eye, Download, BookOpen, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../theme/ThemeProvider';
import { useNotesStore } from '../../store/useNotesStore';

export const NotesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  const { 
    chapters, notes, recentNotes, isLoading, 
    searchQuery, setSearchQuery, selectedChapterId, setSelectedChapterId, 
    initializeNotes, fetchNotes 
  } = useNotesStore();

  useEffect(() => {
    initializeNotes();
  }, []);

  const handleSearchSubmit = () => {
    fetchNotes();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Library</Text>
        
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search notes, topics..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chaptersStrip}>
          <TouchableOpacity 
            style={[
              styles.chapterPill, 
              { backgroundColor: selectedChapterId === null ? theme.colors.primary : theme.colors.surface,
                borderColor: selectedChapterId === null ? theme.colors.primary : theme.colors.border }
            ]}
            onPress={() => setSelectedChapterId(null)}
          >
            <Text style={[styles.chapterPillText, { color: selectedChapterId === null ? '#FFF' : theme.colors.text }]}>
              All Topics
            </Text>
          </TouchableOpacity>

          {chapters.map((chapter) => {
            const isSelected = selectedChapterId === chapter.id;
            return (
              <TouchableOpacity 
                key={chapter.id}
                style={[
                  styles.chapterPill, 
                  { backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border }
                ]}
                onPress={() => setSelectedChapterId(chapter.id)}
              >
                <Text style={[styles.chapterPillText, { color: isSelected ? '#FFF' : theme.colors.text }]}>
                  {chapter.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={initializeNotes} tintColor={theme.colors.primary} />
        }
      >

        {recentNotes.length > 0 && selectedChapterId === null && !searchQuery && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Clock size={20} color={theme.colors.text} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Continue Reading</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentStrip}>
              {recentNotes.map((progress, index) => {
                const percent = progress.totalPages > 0 ? (progress.currentPage / progress.totalPages) * 100 : 0;
                return (
                  <TouchableOpacity 
                    key={`${progress.noteId}-${index}`} 
                    style={[styles.recentCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    onPress={() => navigation.navigate('NoteReader', { noteId: progress.noteId })}
                  >
                    <Text style={[styles.recentChapter, { color: theme.colors.primary }]} numberOfLines={1}>
                      {progress.note.chapter.title}
                    </Text>
                    <Text style={[styles.recentTitle, { color: theme.colors.text }]} numberOfLines={2}>
                      {progress.note.title}
                    </Text>
                    
                    <View style={styles.progressArea}>
                      <View style={[styles.progressBarBg, { backgroundColor: theme.colors.border }]}>
                        <View style={[styles.progressBarFill, { backgroundColor: theme.colors.primary, width: `${percent}%` }]} />
                      </View>
                      <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                        {Math.round(percent)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 16 }]}>
            {searchQuery ? `Search results for "${searchQuery}"` : 'Available Notes'}
          </Text>

          {notes.length === 0 && !isLoading ? (
            <View style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.surface }]}>
                <BookOpen size={24} color={theme.colors.textSecondary} />
              </View>
              <Text style={[styles.emptyCardTitle, { color: theme.colors.text }]}>No Notes Found</Text>
              <Text style={[styles.emptyCardDesc, { color: theme.colors.textSecondary }]}>
                Try adjusting your search or selecting a different topic.
              </Text>
            </View>
          ) : (
            notes.map((note, index) => (
              <TouchableOpacity 
                key={note.id} 
                style={[styles.noteCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => navigation.navigate('NoteReader', { noteId: note.id })}
              >
                <View style={[styles.noteIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <FileText size={24} color={theme.colors.primary} />
                </View>
                
                <View style={styles.noteContent}>
                  <Text style={[styles.noteChapter, { color: theme.colors.primary }]}>{note.chapter}</Text>
                  <Text style={[styles.noteTitle, { color: theme.colors.text }]} numberOfLines={1}>{note.title}</Text>
                  {note.description && (
                    <Text style={[styles.noteDesc, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                      {note.description}
                    </Text>
                  )}
                  
                  <View style={styles.noteStats}>
                    <View style={styles.statItem}>
                      <Eye size={14} color={theme.colors.textSecondary} />
                      <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{note.views}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Download size={14} color={theme.colors.textSecondary} />
                      <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{note.downloads}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  header: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(150, 150, 150, 0.1)' },
  headerTitle: { fontSize: 28, fontWeight: '800', paddingHorizontal: 20, marginBottom: 16 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 16, height: 50, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '500' },

  chaptersStrip: { paddingHorizontal: 20, gap: 8, paddingBottom: 4 },
  chapterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chapterPillText: { fontSize: 13, fontWeight: '600' },

  scrollContent: { padding: 20 },
  section: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },

  recentStrip: { gap: 12, marginHorizontal: -20, paddingHorizontal: 20 },
  recentCard: { width: 220, padding: 16, borderRadius: 16, borderWidth: 1 },
  recentChapter: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  recentTitle: { fontSize: 15, fontWeight: '700', marginBottom: 16, lineHeight: 20 },
  progressArea: { gap: 6 },
  progressBarBg: { height: 6, borderRadius: 3, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 11, fontWeight: '600', textAlign: 'right' },

  noteCard: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12, alignItems: 'center' },
  noteIconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  noteContent: { flex: 1 },
  noteChapter: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  noteTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  noteDesc: { fontSize: 13, marginBottom: 8 },
  noteStats: { flexDirection: 'row', gap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, fontWeight: '600' },

  emptyCard: { padding: 32, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyCardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyCardDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});