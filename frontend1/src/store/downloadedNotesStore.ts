import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DownloadedNote {
  noteId: string;
  title: string;
  localUri: string;
  downloadedAt: string;
}

interface DownloadedNotesState {
  notes: DownloadedNote[];

  loadDownloadedNotes: () => Promise<void>;

  addDownloadedNote: (
    note: DownloadedNote
  ) => Promise<void>;

  removeDownloadedNote: (
    noteId: string
  ) => Promise<void>;
}

const STORAGE_KEY =
  "downloaded_notes";

export const useDownloadedNotesStore =
  create<DownloadedNotesState>(
    (set, get) => ({

      notes: [],

      loadDownloadedNotes:
        async () => {

          const data =
            await AsyncStorage.getItem(
              STORAGE_KEY
            );

          if (data) {

            set({
              notes:
                JSON.parse(data),
            });
          }
        },

      addDownloadedNote:
        async note => {

          const updated = [
            note,
            ...get().notes.filter(
              item =>
                item.noteId !==
                note.noteId
            ),
          ];

          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              updated
            )
          );

          set({
            notes: updated,
          });
        },

      removeDownloadedNote:
        async noteId => {

          const updated =
            get().notes.filter(
              note =>
                note.noteId !==
                noteId
            );

          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              updated
            )
          );

          set({
            notes: updated,
          });
        },
    })
  );