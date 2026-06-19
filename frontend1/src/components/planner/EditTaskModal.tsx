import React, { useEffect, useState } from "react";
import { 
  Modal, View, Text, TouchableOpacity, StyleSheet, 
  Platform, Pressable, KeyboardAvoidingView, ScrollView 
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeStore } from "../../store/themeStore";
import { usePlannerStore } from "../../store/plannerStore";
import { PlannerTask } from "../../types/planner";
import { createPlannerTaskSchema, CreatePlannerTaskForm } from "../../utils/plannerValidation";
import { ThemePalette } from "../../theme/colors";

import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";

type EditTaskModalProps = {
  visible: boolean;
  task: PlannerTask | null;
  onClose: () => void;
};

const EditTaskModal = ({ visible, task, onClose }: EditTaskModalProps) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const updateTask = usePlannerStore((state) => state.updateTask);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreatePlannerTaskForm>({
    resolver: zodResolver(createPlannerTaskSchema),
    defaultValues: { title: "", description: "", dueDate: new Date().toISOString() },
  });

  useEffect(() => {
    if (task) {
      // Small timeout ensures the form layout is ready before populating data
      const timer = setTimeout(() => {
        reset({ title: task.title, description: task.description ?? "", dueDate: task.dueDate });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [task, reset]);

  const dueDate = watch("dueDate");

  const onSubmit = async (data: CreatePlannerTaskForm) => {
    if (!task) return;
    await updateTask(task.id, { title: data.title, description: data.description, dueDate: data.dueDate });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.container} onStartShouldSetResponder={() => true}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text style={styles.title}>Edit Task</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Feather name="x" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Controller control={control} name="title" render={({ field: { onChange, value } }) => (
                <CustomInput label="Task Title" value={value} onChangeText={onChange} error={errors.title?.message} />
              )} />

              <Controller control={control} name="description" render={({ field: { onChange, value } }) => (
                <CustomInput label="Description" value={value} onChangeText={onChange} multiline numberOfLines={3} error={errors.description?.message} />
              )} />

              <Text style={styles.label}>Due Date</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Feather name="calendar" size={18} color={colors.primary} />
                <Text style={styles.dateText}>
                  {new Date(dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(dueDate)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setValue("dueDate", selectedDate.toISOString());
                  }}
                />
              )}

              <View style={styles.footer}>
                <CustomButton title="Update Task" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
              </View>
              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", },
  keyboardAvoidingView: { flex: 1, justifyContent: "flex-end" },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "800", color: colors.textPrimary },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 14, fontWeight: "600", color: colors.textSecondary, marginBottom: 8, marginTop: 8 },
  dateButton: { flexDirection: "row", alignItems: "center", backgroundColor: colors.background, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, gap: 12 },
  dateText: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  footer: { marginTop: 24 },
});

export default EditTaskModal;