import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Chip from "../common/Chip";
import { useAssignmentStore } from "../../store/assignmentStore";

// Map internal DB status to user-friendly UI labels
const FILTERS = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "SUBMITTED", label: "Submitted" },
  { id: "REVIEWED", label: "Reviewed" },
  { id: "OVERDUE", label: "Overdue" },
];

const AssignmentFilterChips = () => {
  const { selectedStatus, setSelectedStatus } = useAssignmentStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {FILTERS.map((filter) => (
        <Chip
          key={filter.id}
          title={filter.label}
          selected={selectedStatus === filter.id}
          onPress={() => setSelectedStatus(filter.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20, // Matches the AssignmentsScreen container padding perfectly
    gap: 10, // Native gap prevents the need for messy margin calculations on the Chip component
    paddingBottom: 4, // Prevents custom shadows on the chips from getting clipped
  },
});

export default AssignmentFilterChips;