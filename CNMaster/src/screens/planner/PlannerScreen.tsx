import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { CalendarDays, CheckCircle2, Circle, Plus, Trash2, X, Coffee } from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { usePlannerStore } from '../../store/usePlannerStore';
import { Button } from '../../components/ui/Button';

const generateDateStrip = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dateString: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      fullDate: d
    });
  }
  return dates;
};

export const PlannerScreen = () => {
  const { theme } = useTheme();
  const { tasks, isLoading, selectedDate, setSelectedDate, fetchTasks, toggleTask, deleteTask, createTask } = usePlannerStore();
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const dateStrip = useMemo(() => generateDateStrip(), []);

  useEffect(() => {
    fetchTasks(selectedDate);
  }, []);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    const targetDate = new Date(selectedDate);
    targetDate.setHours(12, 0, 0, 0);

    await createTask(newTaskTitle, newTaskDesc, targetDate);
    
    setModalVisible(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>

      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Planner</Text>
          <CalendarDays size={24} color={theme.colors.textSecondary} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateStrip}>
          {dateStrip.map((item) => {
            const isSelected = item.dateString === selectedDate;
            return (
              <TouchableOpacity 
                key={item.dateString}
                onPress={() => setSelectedDate(item.dateString)}
                style={[
                  styles.dateBox, 
                  { backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border }
                ]}
              >
                <Text style={[styles.dayName, { color: isSelected ? '#fff' : theme.colors.textSecondary }]}>
                  {item.dayName}
                </Text>
                <Text style={[styles.dayNumber, { color: isSelected ? '#fff' : theme.colors.text }]}>
                  {item.dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {!isLoading && tasks.length === 0 ? (
          <Animated.View entering={FadeIn.duration(400)} style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.surface }]}>
              <Coffee size={24} color={theme.colors.textSecondary} />
            </View>
            <Text style={[styles.emptyCardTitle, { color: theme.colors.text }]}>A Clear Day</Text>
            <Text style={[styles.emptyCardDesc, { color: theme.colors.textSecondary }]}>
              No tasks scheduled for this date. Tap the '+' button to plan ahead.
            </Text>
          </Animated.View>
        ) : (
          tasks.map((task, index) => (
            <Animated.View key={task.id} entering={FadeInDown.delay(index * 50).springify()}>
              <View style={[styles.taskCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                
                <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkboxArea}>
                  {task.isCompleted ? (
                    <CheckCircle2 size={24} color={theme.colors.primary} />
                  ) : (
                    <Circle size={24} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>

                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskTitle, 
                    { color: task.isCompleted ? theme.colors.textSecondary : theme.colors.text },
                    task.isCompleted && styles.taskCompleted
                  ]}>
                    {task.title}
                  </Text>
                  {task.description ? (
                    <Text style={[styles.taskDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                      {task.description}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteBtn}>
                  <Trash2 size={20} color={theme.colors.error} opacity={0.7} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>New Task</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Target Date</Text>
            <Text style={[styles.dateReadonly, { color: theme.colors.primary, backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Task Title (e.g. Complete React Native Module)"
              placeholderTextColor={theme.colors.textSecondary}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />

            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Description (Optional)"
              placeholderTextColor={theme.colors.textSecondary}
              value={newTaskDesc}
              onChangeText={setNewTaskDesc}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Button 
              title="Add to Planner" 
              onPress={handleCreateTask} 
              disabled={!newTaskTitle.trim()} 
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(150, 150, 150, 0.1)' },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  dateStrip: { paddingHorizontal: 20, gap: 12 },
  dateBox: { width: 56, height: 72, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  dayName: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  dayNumber: { fontSize: 18, fontWeight: '700' },

  listContainer: { padding: 20 },
  taskCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  checkboxArea: { marginRight: 12, marginTop: 2 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  taskCompleted: { textDecorationLine: 'line-through' },
  taskDesc: { fontSize: 13, lineHeight: 18 },
  deleteBtn: { padding: 4, marginLeft: 8 },
  bottomPadding: { height: 100 },

  emptyCard: { padding: 32, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyCardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyCardDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },

  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderBottomWidth: 0 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  inputLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
  dateReadonly: { padding: 12, borderRadius: 8, fontSize: 14, fontWeight: '600', marginBottom: 16, overflow: 'hidden' },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 15, marginBottom: 16 },
  textArea: { height: 100, paddingTop: 16 },
});