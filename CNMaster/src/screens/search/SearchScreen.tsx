import React, { useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Search as SearchIcon, X, BookOpen, FileText, Target, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../theme/ThemeProvider';
import { useSearchStore } from '../../store/useSearchStore';

export const SearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  
  const { query, setQuery, results, isLoading, performSearch, clearSearch } = useSearchStore();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(query);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    return () => clearSearch();
  }, []);

  const hasResults = results.chapters.length > 0 || results.notes.length > 0 || results.assignments.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <SearchIcon size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search for chapters, notes, assignments..."
            placeholderTextColor={theme.colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            maxLength={100}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
              <X size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {isLoading && query.length > 0 && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        {!isLoading && query.length > 0 && !hasResults && (
          <Animated.View entering={FadeInDown} style={styles.centerContainer}>
            <SearchIcon size={48} color={theme.colors.textSecondary} style={{ marginBottom: 16, opacity: 0.5 }} />
            <Text style={[styles.noResultsTitle, { color: theme.colors.text }]}>No results found</Text>
            <Text style={[styles.noResultsDesc, { color: theme.colors.textSecondary }]}>
              We couldn't find anything matching "{query}".
            </Text>
          </Animated.View>
        )}

        {results.chapters.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100)} exiting={FadeOutUp} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Chapters</Text>
            {results.chapters.map(chapter => (
              <TouchableOpacity 
                key={chapter.id} 
                style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                // navigation.navigate('ChapterDetails', { chapterId: chapter.id })
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <BookOpen size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>{chapter.title}</Text>
                  {chapter.description && (
                    <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]} numberOfLines={1}>{chapter.description}</Text>
                  )}
                </View>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {results.notes.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150)} exiting={FadeOutUp} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notes</Text>
            {results.notes.map(note => (
              <TouchableOpacity 
                key={note.id} 
                style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                // navigation.navigate('NoteViewer', { noteId: note.id })
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <FileText size={20} color="#10B981" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardBadge, { color: '#10B981' }]}>{note.chapter.title}</Text>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>{note.title}</Text>
                </View>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {results.assignments.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200)} exiting={FadeOutUp} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Assignments</Text>
            {results.assignments.map(assignment => (
              <TouchableOpacity 
                key={assignment.id} 
                style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                // navigation.navigate('AssignmentDetails', { assignmentId: assignment.id })
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <Target size={20} color="#F59E0B" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardBadge, { color: '#F59E0B' }]}>{assignment.chapter.title}</Text>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>{assignment.title}</Text>
                </View>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  header: { padding: 16, borderBottomWidth: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '500' },
  clearBtn: { padding: 8 },

  scrollContent: { padding: 20 },
  centerContainer: { marginTop: 60, alignItems: 'center', justifyContent: 'center' },
  
  noResultsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  noResultsDesc: { fontSize: 15, textAlign: 'center' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },

  resultCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  
  cardContent: { flex: 1, marginRight: 12 },
  cardBadge: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 14 },
});