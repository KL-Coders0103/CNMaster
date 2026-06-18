import React, {
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
  useForm,
  Controller,
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
  createAddTaskModalStyles,
} from "../../styles/components/planner/addTaskModalStyles";

import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";

import {
  createPlannerTaskSchema,
  CreatePlannerTaskForm,
} from "../../utils/plannerValidation";

type AddTaskModalProps = {
  visible: boolean;

  onClose: () => void;
};

const AddTaskModal = ({
  visible,
  onClose,
}: AddTaskModalProps) => {

  const colors =
    useThemeStore(
      state => state.colors
    );

  const styles =
    createAddTaskModalStyles(
      colors
    );

  const createTask =
    usePlannerStore(
      state => state.createTask
    );

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  const dueDate =
    watch("dueDate");

  const onSubmit =
    async (
      data: CreatePlannerTaskForm
    ) => {

      await createTask({
        title:
          data.title,

        description:
          data.description,

        dueDate:
          data.dueDate,
      });

      reset();

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
            Create Task
          </Text>

          <Controller
            control={control}
            name="title"
            render={({
              field: {
                onChange,
                value,
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
                onChange,
                value,
              },
            }) => (
              <CustomInput
                label="Description"
                value={value}
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
            title="Create Task"
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

export default AddTaskModal;