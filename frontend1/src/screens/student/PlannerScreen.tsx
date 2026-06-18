import React, {
  useEffect,
  useState,
} from "react";

import {
  ScrollView,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import PlannerHeader from "../../components/planner/PlannerHeader";
import EmptyPlanner from "../../components/planner/EmptyPlanner";
import TaskSection from "../../components/planner/TaskSection";

import {
  useThemeStore,
} from "../../store/themeStore";

import {
  usePlannerStore,
} from "../../store/plannerStore";

import {
  createPlannerScreenStyles,
} from "../../styles/screens/plannerScreenStyles";
import PlannerStats from "../../components/planner/PlannerStats";
import CalendarStrip from "../../components/planner/CalendarStrip";
import AddTaskModal from "../../components/planner/AddTaskModal";
import { PlannerTask } from "../../types/planner";
import EditTaskModal from "../../components/planner/EditTaskModal";
import DeleteTaskModal from "../../components/planner/DeleteTaskModal";
import {
  formatLocalDate,
} from "../../utils/dateUtils";

const PlannerScreen =
  () => {

    const colors =
      useThemeStore(
        state => state.colors
      );

    const styles =
      createPlannerScreenStyles(
        colors
      );

    const {
      tasks,
      fetchTasks,
      toggleTask,
      deleteTask,
      calendarDates,
      fetchCalendarDates,
      openAddTaskModal,
      setOpenAddTaskModal
    } =
      usePlannerStore();

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [selectedTask, setSelectedTask] = useState<PlannerTask | null>(null);

    const [isEditTaskModalVisible, setIsEditTaskModalvisible] = useState(false);

    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    useEffect(() => {

      const formattedDate = formatLocalDate(selectedDate);

      fetchTasks(formattedDate);
    }, [selectedDate]);

    useEffect(() =>{
      fetchCalendarDates();
    }, []);

    const pendingTasks =
      tasks.filter(
        task =>
          !task.isCompleted
      );

    const completedTasks =
      tasks.filter(
        task =>
          task.isCompleted
      );

    const handleDeleteTask = async () => {
      if(!taskToDelete) return;

      await deleteTask(taskToDelete);
      setTaskToDelete(null);
      setIsDeleteModalVisible(false);
    }

    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.contentContainer
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <PlannerHeader
            onAddTask={() => {setOpenAddTaskModal(true)}}
          />

          <PlannerStats totalTasks={tasks.length} completedTasks={completedTasks.length} />

          <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} calendarDates={calendarDates} />

          {tasks.length ===
          0 ? (
            <EmptyPlanner />
          ) : (
            <>
              <TaskSection
                title="Pending Tasks"
                tasks={
                  pendingTasks
                }
                onToggle={
                  toggleTask
                }
                onEdit={(task) => {
                  setSelectedTask(task);
                  setIsEditTaskModalvisible(true);
                }}
                onDelete={(taskId) => {
                  setTaskToDelete(taskId);
                  setIsDeleteModalVisible(true);
                }}
              />

              <TaskSection
                title="Completed Tasks"
                tasks={
                  completedTasks
                }
                onToggle={
                  toggleTask
                }
                onEdit={(task) => {
                  setSelectedTask(task);
                  setIsEditTaskModalvisible(true);
                }}
                onDelete={(taskId) => {
                  setTaskToDelete(taskId);
                  setIsDeleteModalVisible(true);
                }}
              />
            </>
          )}
        </ScrollView>

        <AddTaskModal 
          visible={openAddTaskModal} 
          onClose={() => setOpenAddTaskModal(false)} 
        />
        <EditTaskModal 
          visible={isEditTaskModalVisible} 
          task={selectedTask} 
          onClose={() => {
            setSelectedTask(null);
            setIsEditTaskModalvisible(false);
          }}
        />
        <DeleteTaskModal 
          visible={isDeleteModalVisible} 
          onClose={() => {
            setTaskToDelete(null); setIsDeleteModalVisible(false)
          }} 
          onConfirm={handleDeleteTask} 
        />
      </SafeAreaView>
    );
  };

export default PlannerScreen;