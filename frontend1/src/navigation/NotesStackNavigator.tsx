import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotesScreen from "../screens/student/NotesScreen";
import NoteDetailScreen from "../screens/student/NoteDetailScreen";
import PdfViewerScreen from "../screens/student/PdfViewerScreen";
import DownloadedNotesScreen from "../screens/student/DownloadedNotesScreen";
// import { ContextualTutorScreen } from "../screens/student/ContextualTutorScreen"; // <-- Import the new screen

export type NotesStackParamList = {
  NotesHome: undefined;
  NoteDetail: { noteId: string };
  PdfViewer: {
    noteId: string;
    pdfUrl: string;
    title: string;
  };
  DownloadedNotes: undefined;
  // <-- Add the Tutor Route
  ContextualTutor: {
    noteId: string;
    noteTitle: string;
  };
};

const Stack = createNativeStackNavigator<NotesStackParamList>();

const NotesStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotesHome" component={NotesScreen} />
      <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
      <Stack.Screen name="DownloadedNotes" component={DownloadedNotesScreen} />
      <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
      {/* Add the Tutor Screen */}
      {/* <Stack.Screen 
        name="ContextualTutor" 
        component={ContextualTutorScreen} 
        options={{ presentation: "modal" }} // Optional: Makes it slide up like a chat modal
      /> */}
    </Stack.Navigator>
  );
};

export default NotesStackNavigator;