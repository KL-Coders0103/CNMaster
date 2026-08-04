import { create } from 'zustand';
import { api } from '../services/api';
import { PlannerTask } from '../types';
import Toast from 'react-native-toast-message';

interface PlannerState {
  tasks: PlannerTask[];
  isLoading: boolean;
  selectedDate: string;
  
  setSelectedDate: (date: string) => void;
  fetchTasks: (date: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  createTask: (title: string, description: string, dueDate: Date) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  tasks: [],
  isLoading: true,
  selectedDate: new Date().toISOString().split('T')[0],

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchTasks(date);
  },

  fetchTasks: async (date) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/planner/tasks?date=${date}`);
      if (response.data?.success) {
        set({ tasks: response.data.data, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      set({ isLoading: false });
    }
  },

  toggleTask: async (taskId) => {
    const previousTasks = get().tasks;
    set({
      tasks: previousTasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    });

    try {
      const response = await api.patch(`/planner/tasks/${taskId}/toggle`);
      if (response.data?.success) {
        if (response.data.data.isCompleted) {
          Toast.show({ type: 'success', text1: 'Task Completed! XP Awarded 🎉' });
        }
      }
    } catch (error) {
      set({ tasks: previousTasks });
      Toast.show({ type: 'error', text1: 'Failed to update task' });
    }
  },

  createTask: async (title, description, dueDate) => {
    try {
      const response = await api.post('/planner/tasks', { 
        title, 
        description, 
        dueDate: dueDate.toISOString() 
      });
      
      if (response.data?.success) {
        Toast.show({ type: 'success', text1: 'Task Created!' });
        get().fetchTasks(get().selectedDate);
      }
    } catch (error: any) {
      Toast.show({ 
        type: 'error', 
        text1: 'Failed to create task', 
        text2: error.response?.data?.message || 'Check your inputs' 
      });
    }
  },

  deleteTask: async (taskId) => {
    const previousTasks = get().tasks;
    set({ tasks: previousTasks.filter(t => t.id !== taskId) });

    try {
      await api.delete(`/planner/tasks/${taskId}`);
    } catch (error) {
      set({ tasks: previousTasks });
      Toast.show({ type: 'error', text1: 'Failed to delete task' });
    }
  }
}));