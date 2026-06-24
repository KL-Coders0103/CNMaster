import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";
import { useSearchStore } from "../../store/searchStore"; 

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  
  const [query, setQuery] = useState("");
  const { results, isLoading, performSearch, clearSearch } = useSearchStore();

  // CRITICAL: Debounce Logic to prevent slamming the backend API on every keystroke
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        clearSearch();
      }
    }, 500); // Waits 500ms after the user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [query, performSearch, clearSearch]);

  // Format the backend object into a SectionList array
  const sections = [
    { title: "Notes", data: results.notes || [], icon: "book-open" },
    { title: "Assignments", data: results.assignments || [], icon: "clipboard" },
    { title: "Chapters", data: results.chapters || [], icon: "layers" },
  ].filter(section => section.data.length > 0); // Only show sections that have results

  const totalResults = sections.reduce((sum, section) => sum + section.data.length, 0);

  const handleResultPress = (item: any, sectionTitle: string) => {
    // Navigate based on what they clicked!
    if (sectionTitle === "Notes") navigation.navigate("Notes", { screen: "NoteDetail", params: { noteId: item.id } });
    if (sectionTitle === "Assignments") navigation.navigate("Assignments", { screen: "AssignmentDetail", params: { assignmentId: item.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes, chapters, assignments..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus={true} 
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} style={styles.clearButton}>
              <Feather name="x" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Area */}
      {query.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="search" size={48} color={colors.textSecondary} style={{ opacity: 0.3, marginBottom: 16 }} />
          <Text style={styles.emptyText}>What are you looking for?</Text>
          <Text style={styles.emptySubtext}>Find any topic, assignment, or note instantly.</Text>
        </View>
      ) : isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptySubtext, { marginTop: 16 }]}>Searching database...</Text>
        </View>
      ) : totalResults === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="inbox" size={48} color={colors.textSecondary} style={{ opacity: 0.3, marginBottom: 16 }} />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>We couldn't find anything matching "{query}".</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id + index.toString()}
          contentContainerStyle={{ padding: 16 }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionTitle}>{section.title}</Text>
          )}
          renderItem={({ item, section }) => (
            <TouchableOpacity 
              style={styles.resultCard} 
              activeOpacity={0.7}
              onPress={() => handleResultPress(item, section.title)}
            >
              <View style={styles.resultIcon}>
                <Feather name={section.icon as any} size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                {item.description ? (
                  <Text style={styles.resultDesc} numberOfLines={1}>{item.description}</Text>
                ) : null}
              </View>
              <Feather name="chevron-right" size={20} color={colors.border} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12,
  },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center" },
  searchContainer: {
    flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.surface,
    borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15, fontWeight: "500" },
  clearButton: { padding: 4 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  emptySubtext: { fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: "center" },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginTop: 20, marginBottom: 8, marginLeft: 4 },
  resultCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, padding: 16,
    borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: colors.border,
  },
  resultIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryLight || "rgba(79, 70, 229, 0.1)", justifyContent: "center", alignItems: "center", marginRight: 12 },
  resultTitle: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, marginBottom: 2 },
  resultDesc: { fontSize: 13, color: colors.textSecondary },
});

export default SearchScreen;