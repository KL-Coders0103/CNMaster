import React, {
  useState,
} from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
} from "react-native";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import Toast from "react-native-toast-message";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import AuthHeader from "../../components/AuthHeader";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

import {
  resetPasswordStyles,
} from "../../styles/screens/resetPasswordStyles";

import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "../../utils/resetPasswordSchema";

import {
  resetPassword,
} from "../../services/authService";

import {
  AuthStackParamList,
} from "../../navigation/AuthNavigator";
import PasswordStrengthIndicator from "../../components/PasswordStrenghtIndicator";

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "ResetPassword"
  >;

const ResetPasswordScreen = ({
  navigation,
  route,
}: Props) => {
  const {
    email,
    otp,
  } = route.params;

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<
    ResetPasswordFormData
  >({
    resolver:
      zodResolver(
        resetPasswordSchema
      ),

    defaultValues: {
      password: "",
      confirmPassword:
        "",
    },
  });

  const onSubmit =
    async (
      data: ResetPasswordFormData
    ) => {
      try {
        const response =
          await resetPassword({
            email,
            otp,
            password:
              data.password,
          });

        Toast.show({
          type: "success",
          text1:
            "Password Reset",
          text2:
            response.message,
        });

        navigation.reset({
          index: 0,
          routes: [
            {
              name:
                "Login",
            },
          ],
        });
      } catch (
        error: any
      ) {
        Toast.show({
          type: "error",
          text1:
            "Failed",
          text2:
            error?.response
              ?.data
              ?.message ??
            "Something went wrong",
        });
      }
    };

  return (
    <KeyboardAvoidingView
      style={
        resetPasswordStyles.container
      }
      behavior={
        Platform.OS ===
        "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          resetPasswordStyles.scrollContainer
        }
      >
        <View
          style={
            resetPasswordStyles.headerContainer
          }
        >
          <View
            style={
              resetPasswordStyles.badge
            }
          >
            <Text
              style={
                resetPasswordStyles.badgeText
              }
            >
              CN MASTER
            </Text>
          </View>

          <Text
            style={
              resetPasswordStyles.title
            }
          >
            Create a{"\n"}
            new password
          </Text>

          <Text
            style={
              resetPasswordStyles.subtitle
            }
          >
            Your new password
            should be strong and
            different from previous
            passwords.
          </Text>
        </View>

        <View
          style={
            resetPasswordStyles.formContainer
          }
        >
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <>
                <CustomInput
                  label="New Password"
                  placeholder="Enter password"
                  value={field.value}
                  onChangeText={
                    field.onChange
                  }
                  secureTextEntry={
                    !showPassword
                  }
                  rightText={
                    showPassword
                      ? "Hide"
                      : "Show"
                  }
                  onRightPress={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  error={
                    errors.password
                      ?.message
                  }
                />

                <PasswordStrengthIndicator
                  password={
                    field.value
                  }
                />
              </>
            )}
          />

          <Controller
            control={
              control
            }
            name="confirmPassword"
            render={({
              field,
            }) => (
              <CustomInput
                label="Confirm Password"
                placeholder="Confirm password"
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                secureTextEntry={
                  !showConfirmPassword
                }
                rightText={
                  showConfirmPassword
                    ? "Hide"
                    : "Show"
                }
                onRightPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                error={
                  errors
                    .confirmPassword
                    ?.message
                }
              />
            )}
          />

          <CustomButton
            title="Reset Password"
            loading={
              isSubmitting
            }
            onPress={handleSubmit(
              onSubmit
            )}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;