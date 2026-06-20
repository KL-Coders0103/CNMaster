import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Note } from "../../types/notes";
import { useThemeStore } from "../../store/themeStore";
import { getNoteCardStyles } from "../../styles/components/notes/noteCardStyles";

type Props = {
  note: Note;
  onPress: () => void;
};

const NoteCard = ({ note, onPress }: Props) => {
  const { colors } = useThemeStore();
  const styles = getNoteCardStyles(colors);

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.pdfBadge}>
          <Feather name="file-text" size={22} color={colors.primary} />
        </View>

        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>
            {note.title}
          </Text>
          {!!note.description && (
            <Text numberOfLines={2} style={styles.description}>
              {note.description}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{note.subject}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{note.chapter}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Feather name="eye" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{note.views}</Text>
          </View>
          <View style={[styles.meta, { marginLeft: 16 }]}>
            <Feather name="download" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{note.downloads}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NoteCard;