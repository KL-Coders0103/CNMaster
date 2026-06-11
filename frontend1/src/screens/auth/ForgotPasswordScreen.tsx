import React from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
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
  forgotPasswordStyles,
} from "../../styles/screens/forgotPasswordStyles";

import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "../../utils/forgotPasswordSchema";

import {
  forgotPassword,
} from "../../services/authService";

import {
  AuthStackParamList,
} from "../../navigation/AuthNavigator";

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "ForgotPassword"
  >;

const ForgotPasswordScreen = ({
  navigation,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<
    ForgotPasswordFormData
  >({
    resolver:
      zodResolver(
        forgotPasswordSchema
      ),

    defaultValues: {
      email: "",
    },
  });

  const onSubmit =
    async (
      data: ForgotPasswordFormData
    ) => {
      try {
        const response =
          await forgotPassword({
            email:
              data.email
                .trim()
                .toLowerCase(),
          });

        Toast.show({
          type: "success",
          text1:
            "OTP Sent",
          text2:
            response.message,
        });

        navigation.navigate(
          "VerifyForgotOtp",
          {
            email:
              data.email,
          }
        );
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
        forgotPasswordStyles.container
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
          forgotPasswordStyles.scrollContainer
        }
      >
        <View
          style={
            forgotPasswordStyles.headerContainer
          }
        >
          <View
            style={
              forgotPasswordStyles.badge
            }
          >
            <Text
              style={
                forgotPasswordStyles.badgeText
              }
            >
              CN MASTER
            </Text>
          </View>

          <Text
            style={
              forgotPasswordStyles.title
            }
          >
            Forgot{"\n"}
            password?
          </Text>

          <Text
            style={
              forgotPasswordStyles.subtitle
            }
          >
            Don't worry. Enter your
            registered email and
            we'll send you an OTP.
          </Text>
        </View>

        <View
          style={
            forgotPasswordStyles.formContainer
          }
        >
          <Controller
            control={
              control
            }
            name="email"
            render={({
              field,
            }) => (
              <CustomInput
                label="Email"
                placeholder="Enter your email"
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                autoCapitalize="none"
                keyboardType="email-address"
                error={
                  errors
                    .email
                    ?.message
                }
              />
            )}
          />

          <CustomButton
            title="Send OTP"
            loading={
              isSubmitting
            }
            onPress={handleSubmit(
              onSubmit
            )}
          />

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                forgotPasswordStyles.backText
              }
            >
              ← Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;