import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotesScreen from "../screens/student/NotesScreen";
import NoteDetailScreen from "../screens/student/NoteDetailScreen";
import PdfViewerScreen from "../screens/student/PdfViewerScreen";
import DownloadedNotesScreen from "../screens/student/DownloadedNotesScreen";

export type NotesStackParamList = {
  NotesHome: undefined;

  NoteDetail: {
    noteId: string;
  };

  PdfViewer: {
    noteId: string;
    pdfUrl: string;
    title: string;
  };

  DownloadedNotes: undefined;
};

const Stack =
  createNativeStackNavigator<NotesStackParamList>();

const NotesStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="NotesHome"
        component={NotesScreen}
      />

      <Stack.Screen
        name="NoteDetail"
        component={NoteDetailScreen}
      />
      
      <Stack.Screen
        name="DownloadedNotes"
        component={DownloadedNotesScreen}
      />

      <Stack.Screen
        name="PdfViewer"
        component={PdfViewerScreen}
      />

    </Stack.Navigator>
  );
};

export default NotesStackNavigator;