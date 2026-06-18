import React, {
  useEffect,
  useState,
} from "react";

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useThemeStore,
} from "../../store/themeStore";

import {
  usePlannerStore,
} from "../../store/plannerStore";

import {
  PlannerTask,
} from "../../types/planner";

import {
  createAddTaskModalStyles,
} from "../../styles/components/planner/addTaskModalStyles";

import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";

import {
  createPlannerTaskSchema,
  CreatePlannerTaskForm,
} from "../../utils/plannerValidation";

type EditTaskModalProps = {
  visible: boolean;

  task: PlannerTask | null;

  onClose: () => void;
};

const EditTaskModal = ({
  visible,
  task,
  onClose,
}: EditTaskModalProps) => {

  const colors =
    useThemeStore(
      state => state.colors
    );

  const styles =
    createAddTaskModalStyles(
      colors
    );

  const updateTask =
    usePlannerStore(
      state => state.updateTask
    );

  const [
    showDatePicker,
    setShowDatePicker,
  ] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreatePlannerTaskForm>({
    resolver:
      zodResolver(
        createPlannerTaskSchema
      ),

    defaultValues: {
      title: "",
      description: "",
      dueDate:
        new Date().toISOString(),
    },
  });

  useEffect(() => {

    if (!task) {
      return;
    }

    reset({
      title:
        task.title,

      description:
        task.description ??
        "",

      dueDate:
        task.dueDate,
    });

  }, [
    task,
    reset,
  ]);

  const dueDate =
    watch("dueDate");

  const onSubmit =
    async (
      data: CreatePlannerTaskForm
    ) => {

      if (!task) {
        return;
      }

      await updateTask(
        task.id,
        {
          title:
            data.title,

          description:
            data.description,

          dueDate:
            data.dueDate,
        }
      );

      onClose();
    };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View
        style={
          styles.overlay
        }
      >
        <View
          style={
            styles.container
          }
        >
          <Text
            style={
              styles.title
            }
          >
            Edit Task
          </Text>

          <Controller
            control={control}
            name="title"
            render={({
              field: {
                value,
                onChange,
              },
            }) => (
              <CustomInput
                label="Task Title"
                value={value}
                onChangeText={
                  onChange
                }
                error={
                  errors.title
                    ?.message
                }
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({
              field: {
                value,
                onChange,
              },
            }) => (
              <CustomInput
                label="Description"
                value={
                  value ?? ""
                }
                onChangeText={
                  onChange
                }
                multiline
                numberOfLines={4}
                error={
                  errors.description
                    ?.message
                }
              />
            )}
          />

          <TouchableOpacity
            style={
              styles.dateButton
            }
            onPress={() =>
              setShowDatePicker(
                true
              )
            }
          >
            <Text
              style={
                styles.dateText
              }
            >
              {new Date(
                dueDate
              ).toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={
                new Date(
                  dueDate
                )
              }
              mode="date"
              display={
                Platform.OS ===
                "ios"
                  ? "spinner"
                  : "default"
              }
              onChange={(
                _,
                selectedDate
              ) => {

                setShowDatePicker(
                  false
                );

                if (
                  selectedDate
                ) {
                  setValue(
                    "dueDate",
                    selectedDate.toISOString()
                  );
                }
              }}
            />
          )}

          <CustomButton
            title="Update Task"
            loading={
              isSubmitting
            }
            onPress={handleSubmit(
              onSubmit
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditTaskModal;