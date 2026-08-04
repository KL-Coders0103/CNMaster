import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, UploadCloud, FileText, CheckCircle2, Clock, AlertCircle, X, FileUp } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '../../theme/ThemeProvider';
import { useAssignmentsStore } from '../../store/useAssignmentStore';

export const AssignmentDetailsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { assignmentId } = route.params as { assignmentId: string };

  const { currentAssignment, isLoading, isSubmitting, fetchAssignmentDetails, submitAssignment } = useAssignmentsStore();
  
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  useEffect(() => {
    fetchAssignmentDetails(assignmentId);
  }, [assignmentId]);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', 
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking document", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !currentAssignment) return;

    const success = await submitAssignment(
      currentAssignment.id,
      selectedFile.uri,
      selectedFile.name,
      selectedFile.mimeType || 'application/pdf'
    );

    if (success) {
      setSelectedFile(null); 
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return theme.colors.primary;
      case 'GRADED': return '#10B981';
      case 'OVERDUE': return theme.colors.error;
      default: return '#F59E0B';
    }
  };

  if (isLoading || !currentAssignment) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading Details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPending = currentAssignment.submissionStatus === 'PENDING' || currentAssignment.submissionStatus === 'OVERDUE';
  const statusColor = getStatusColor(currentAssignment.submissionStatus);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Assignment</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.infoSection}>
          <Text style={[styles.chapterBadge, { color: theme.colors.primary, backgroundColor: `${theme.colors.primary}15` }]}>
            {currentAssignment.chapter.title}
          </Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>{currentAssignment.title}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                Due: {new Date(currentAssignment.dueDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <CheckCircle2 size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                {currentAssignment.maxMarks} Marks
              </Text>
            </View>
          </View>

          <View style={[styles.statusBanner, { backgroundColor: `${statusColor}15`, borderColor: `${statusColor}30` }]}>
            {currentAssignment.submissionStatus === 'OVERDUE' && <AlertCircle size={20} color={statusColor} />}
            <Text style={[styles.statusBannerText, { color: statusColor }]}>
              Status: {currentAssignment.submissionStatus}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Instructions</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {currentAssignment.description}
          </Text>
        </View>

        <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Submission</Text>

          {currentAssignment.submissionStatus === 'GRADED' && (
            <View style={[styles.feedbackCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.scoreCircle}>
                <Text style={[styles.scoreText, { color: theme.colors.primary }]}>{currentAssignment.marksObtained}</Text>
                <Text style={styles.scoreSubText}>/{currentAssignment.maxMarks}</Text>
              </View>
              <View style={styles.feedbackContent}>
                <Text style={[styles.feedbackLabel, { color: theme.colors.text }]}>Teacher's Feedback:</Text>
                <Text style={[styles.feedbackText, { color: theme.colors.textSecondary }]}>
                  {currentAssignment.feedback || "No additional feedback provided."}
                </Text>
              </View>
            </View>
          )}

          {currentAssignment.submissionStatus === 'SUBMITTED' && (
            <View style={[styles.submittedCard, { backgroundColor: `${theme.colors.primary}10`, borderColor: `${theme.colors.primary}30` }]}>
              <CheckCircle2 size={32} color={theme.colors.primary} style={{ marginBottom: 12 }} />
              <Text style={[styles.submittedTitle, { color: theme.colors.text }]}>Successfully Submitted!</Text>
              <Text style={[styles.submittedDesc, { color: theme.colors.textSecondary }]}>
                Waiting for the instructor to grade your work.
              </Text>
            </View>
          )}

          {isPending && (
            <View style={styles.uploadContainer}>
              {!selectedFile ? (
                <TouchableOpacity 
                  style={[styles.uploadBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={handlePickDocument}
                >
                  <UploadCloud size={32} color={theme.colors.primary} style={{ marginBottom: 12 }} />
                  <Text style={[styles.uploadTitle, { color: theme.colors.text }]}>Tap to select a PDF</Text>
                  <Text style={[styles.uploadSubtitle, { color: theme.colors.textSecondary }]}>Max file size: 10MB</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.selectedFileBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }]}>
                  <FileText size={24} color={theme.colors.primary} />
                  <Text style={[styles.fileName, { color: theme.colors.text }]} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedFile(null)} style={styles.clearBtn} disabled={isSubmitting}>
                    <X size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity 
                style={[
                  styles.submitBtn, 
                  { backgroundColor: !selectedFile || isSubmitting ? theme.colors.surface : theme.colors.primary }
                ]}
                disabled={!selectedFile || isSubmitting}
                onPress={handleSubmit}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={theme.colors.text} />
                ) : (
                  <>
                    <FileUp size={20} color={!selectedFile ? theme.colors.textSecondary : '#FFF'} />
                    <Text style={[
                      styles.submitBtnText, 
                      { color: !selectedFile ? theme.colors.textSecondary : '#FFF' }
                    ]}>
                      Submit Assignment
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 14, fontWeight: '500' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1 },
  iconBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700' },

  scrollContent: { padding: 20 },

  infoSection: { marginBottom: 24 },
  chapterBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 14, fontWeight: '500' },
  
  statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  statusBannerText: { fontSize: 14, fontWeight: '700' },

  section: { paddingTop: 24, marginTop: 24, borderTopWidth: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 24 },

  feedbackCard: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  scoreCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  scoreText: { fontSize: 20, fontWeight: '800' },
  scoreSubText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  feedbackContent: { flex: 1 },
  feedbackLabel: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  feedbackText: { fontSize: 14, lineHeight: 20 },

  submittedCard: { padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  submittedTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  submittedDesc: { fontSize: 14, textAlign: 'center' },

  uploadContainer: { marginTop: 8 },
  uploadBox: { padding: 32, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  uploadTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  uploadSubtitle: { fontSize: 13 },
  
  selectedFileBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  fileName: { flex: 1, fontSize: 15, fontWeight: '600', marginLeft: 12 },
  clearBtn: { padding: 4 },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12 },
  submitBtnText: { fontSize: 16, fontWeight: '700' }
});