import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useNotesStore } from "../../store/notesStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const ContinueLearningCard = () => {

  const navigation = useNavigation<any>();

  const recentNotes = useNotesStore(
    state => state.recentNotes
  );

  
  const { colors } =
  useThemeStore();
  
  const styles =
  createStyles(colors);
  
  const note = recentNotes[0];
  
  if (!note) {
    
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Feather
              name="book-open"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Ready to begin?
            </Text>

            <Text style={styles.subtitle}>
              Start your networking journey today.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(
              "Notes"
            )
          }
          >
          <Text
            style={styles.buttonText}
            >
            Explore Notes
          </Text>

          <Feather
            name="arrow-right"
            size={18}
            color={colors.white}
            />
        </TouchableOpacity>
      </View>
    );
  }
  
  const progressPercentage =
    note.totalPages === 0
      ? 0
      : Math.round(
          (note.currentPage /
            note.totalPages) *
            100
        );
        
  return (
    <View style={styles.container}>
      <Text
        style={styles.sectionHeader}
        >
        Continue Learning
      </Text>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(
            "Notes",
            {
              screen:
              "NoteDetail",

              params: {
                noteId:
                  note.note.id,
              },
            }
          )
        }
      >
        <View
          style={styles.cardHeader}
        >
          <View
            style={styles.iconCircle}
          >
            <Feather
              name="play"
              size={20}
              color={colors.primary}
            />
          </View>

          <View
            style={styles.cardText}
          >
            <Text
              style={styles.moduleName}
              numberOfLines={1}
            >
              {note.note.title}
            </Text>

            <Text
              style={styles.progressText}
            >
              Page {note.currentPage}
              {" / "}
              {note.totalPages}
            </Text>
          </View>
        </View>

        <View
          style={styles.progressBar}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%` as any,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (
  colors: ThemePalette
) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },

    sectionHeader: {
      fontSize: 18,
      fontWeight: "800",
      color:
        colors.textPrimary,

      marginBottom: 12,
    },

    card: {
      backgroundColor:
        colors.surface,

      padding: 20,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        colors.border,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.05,

      shadowRadius: 12,

      elevation: 2,
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },

    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,

      backgroundColor:
        "rgba(37,99,235,0.1)",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 16,
    },

    cardText: {
      flex: 1,
    },

    moduleName: {
      fontSize: 16,
      fontWeight: "700",

      color:
        colors.textPrimary,

      marginBottom: 4,
    },

    progressText: {
      fontSize: 13,

      color:
        colors.textSecondary,

      fontWeight: "500",
    },

    progressBar: {
      height: 6,

      backgroundColor:
        colors.background,

      borderRadius: 3,

      overflow: "hidden",
    },

    progressFill: {
      height: "100%",

      backgroundColor:
        colors.primary,

      borderRadius: 3,
    },

    content: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },

    textContainer: {
      flex: 1,
    },

    title: {
      fontSize: 18,
      fontWeight: "700",

      color:
        colors.textPrimary,

      marginBottom: 4,
    },

    subtitle: {
      fontSize: 14,

      color:
        colors.textSecondary,
    },

    button: {
      backgroundColor:
        colors.primary,

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems:
        "center",

      paddingVertical: 14,

      borderRadius: 12,

      gap: 8,
    },

    buttonText: {
      color: colors.white,

      fontSize: 16,

      fontWeight: "700",
    },
  });

export default ContinueLearningCard;