import React from "react";

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  useThemeStore,
} from "../../store/themeStore";

import {
  createDeleteTaskModalStyles,
} from "../../styles/components/planner/deleteTaskModalStyles";

type DeleteTaskModalProps = {
  visible: boolean;

  onClose: () => void;

  onConfirm: () => void;
};

const DeleteTaskModal = ({
  visible,
  onClose,
  onConfirm,
}: DeleteTaskModalProps) => {

  const colors =
    useThemeStore(
      state => state.colors
    );

  const styles =
    createDeleteTaskModalStyles(
      colors
    );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
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
            Delete Task?
          </Text>

          <Text
            style={
              styles.description
            }
          >
            Are you sure you want
            to delete this task?
            This action cannot be
            undone.
          </Text>

          <View
            style={
              styles.actionsContainer
            }
          >
            <TouchableOpacity
              style={
                styles.cancelButton
              }
              onPress={
                onClose
              }
            >
              <Text
                style={
                  styles.cancelText
                }
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.deleteButton
              }
              onPress={
                onConfirm
              }
            >
              <Text
                style={
                  styles.deleteText
                }
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteTaskModal;