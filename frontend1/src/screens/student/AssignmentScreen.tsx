import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

// Store & Custom Hooks
import { useAssignmentStore } from "../../store/assignmentStore";
import { useThemeStore } from "../../store/themeStore";

// Components
import SearchBar from "../../components/common/SearchBar";
import AssignmentCard from "../../components/assignments/AssignmentCard";
import AssignmentFilterChips from "../../components/assignments/AssignmentFilterChips";
import { ThemePalette } from "../../theme/colors";

const AssignmentsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const {
    assignments,
    search,
    isLoading,
    selectedStatus,
    fetchAssignments,
    setSearch,
  } = useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const onRefresh = useCallback(async () => {
    await fetchAssignments();
  }, [fetchAssignments]);

  // Bug Fix: Filter handling with fallbacks to avoid map/filter crashes on undefined state
  const filteredAssignments = (assignments || []).filter((assignment) => {
  const matchesStatus =
    selectedStatus === "ALL" || assignment.submissionStatus === selectedStatus;
  
  // FIX: Added optional chaining and empty string fallback
  const matchesSearch =
    !search || assignment.title?.toLowerCase().includes(search.toLowerCase() ?? "");

  return matchesStatus && matchesSearch;
});

  // Performance Bug Fix: Extracted renderItem with useCallback to prevent frame drops
  const renderAssignmentItem = useCallback(
    ({ item }: { item: any }) => (
      <AssignmentCard
        assignment={item}
        onPress={() =>
          navigation.navigate("AssignmentDetail", {
            assignmentId: item.id,
          })
        }
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={filteredAssignments}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
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
              <Feather
                name="clipboard"
                size={48}
                color={colors.textMuted || colors.textSecondary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No Assignments Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search filters or status updates.
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.headerComponentContainer}>
            {/* 1. Top Bar Block */}
            <View style={styles.headerTop}>
              <View style={styles.headerTextGroup}>
                <Text style={styles.title}>Assignments</Text>
                <Text style={styles.subtitle}>
                  Complete assignments and improve your learning.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate("SubmissionHistory")}
                activeOpacity={0.7}
              >
                <Feather name="clock" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* 2. Interactive Controls Grouping */}
            <View style={styles.searchSection}>
              <SearchBar
                value={search}
                placeholder="Search assignments..."
                onChangeText={setSearch}
              />
            </View>

            <View style={styles.filterSection}>
              <AssignmentFilterChips />
            </View>
          </View>
        }
        renderItem={renderAssignmentItem}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 40,
    },
    headerComponentContainer: {
      marginBottom: 16,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 24,
    },
    headerTextGroup: {
      flex: 1,
      paddingRight: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    historyButton: {
      width: 46,
      height: 46,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    searchSection: {
      marginBottom: 16,
    },
    filterSection: {
      marginBottom: 8,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 60,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      marginBottom: 16,
      opacity: 0.8,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
    },
    emptySubtitle: {
      marginTop: 8,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

export default AssignmentsScreen;