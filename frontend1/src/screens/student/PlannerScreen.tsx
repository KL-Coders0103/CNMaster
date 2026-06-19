import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";

import PlannerHeader from "../../components/planner/PlannerHeader";
import EmptyPlanner from "../../components/planner/EmptyPlanner";
import TaskSection from "../../components/planner/TaskSection";
import PlannerStats from "../../components/planner/PlannerStats";
import CalendarStrip from "../../components/planner/CalendarStrip";
import AddTaskModal from "../../components/planner/AddTaskModal";
import EditTaskModal from "../../components/planner/EditTaskModal";
import DeleteTaskModal from "../../components/planner/DeleteTaskModal";

import { useThemeStore } from "../../store/themeStore";
import { usePlannerStore } from "../../store/plannerStore";
import { ThemePalette } from "../../theme/colors";
import { PlannerTask } from "../../types/planner";
import { formatLocalDate } from "../../utils/dateUtils";

const PlannerScreen = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const {
    tasks,
    fetchTasks,
    toggleTask,
    deleteTask,
    calendarDates,
    fetchCalendarDates,
    openAddTaskModal,
    setOpenAddTaskModal
  } = usePlannerStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<PlannerTask | null>(null);
  const [isEditTaskModalVisible, setIsEditTaskModalvisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const formattedDate = formatLocalDate(selectedDate);
    fetchTasks(formattedDate);
  }, [selectedDate, fetchTasks]);

  useEffect(() => {
    fetchCalendarDates();
  }, [fetchCalendarDates]);

  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  const handleDeleteTask = async () => {
    if(!taskToDelete) return;
    await deleteTask(taskToDelete);
    setTaskToDelete(null);
    setIsDeleteModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header & Stats section */}
        <View style={styles.topSection}>
          <PlannerHeader onAddTask={() => setOpenAddTaskModal(true)} />
          <PlannerStats totalTasks={tasks.length} completedTasks={completedTasks.length} />
        </View>

        {/* Calendar - Full width visual */}
        <CalendarStrip 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
          calendarDates={calendarDates} 
        />

        {tasks.length === 0 ? (
          <EmptyPlanner />
        ) : (
          <View style={styles.taskListContainer}>
            <TaskSection
              title="Pending"
              tasks={pendingTasks}
              onToggle={toggleTask}
              onEdit={(task) => { setSelectedTask(task); setIsEditTaskModalvisible(true); }}
              onDelete={(taskId) => { setTaskToDelete(taskId); setIsDeleteModalVisible(true); }}
            />

            <TaskSection
              title="Completed"
              tasks={completedTasks}
              onToggle={toggleTask}
              onEdit={(task) => { setSelectedTask(task); setIsEditTaskModalvisible(true); }}
              onDelete={(taskId) => { setTaskToDelete(taskId); setIsDeleteModalVisible(true); }}
            />
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <AddTaskModal 
        visible={openAddTaskModal} 
        onClose={() => setOpenAddTaskModal(false)} 
      />
      <EditTaskModal 
        visible={isEditTaskModalVisible} 
        task={selectedTask} 
        onClose={() => { setSelectedTask(null); setIsEditTaskModalvisible(false); }}
      />
      <DeleteTaskModal 
        visible={isDeleteModalVisible} 
        onClose={() => { setTaskToDelete(null); setIsDeleteModalVisible(false); }} 
        onConfirm={handleDeleteTask} 
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  topSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  taskListContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
});

export default PlannerScreen;