import React, {
  useEffect,
  useState,
} from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
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

import AuthHeader from "../../components/common/AuthHeader";
import OtpInput from "../../components/common/OtpInput";
import CustomButton from "../../components/common/CustomButton";

import {
  verifyForgotOtpStyles,
} from "../../styles/screens/verifyForgotOtpStyles";

import {
  verifyForgotOtpSchema,
  VerifyForgotOtpFormData,
} from "../../utils/verifyForgotOtpSchema";

import {
  forgotPassword,
  verifyForgotOtp,
} from "../../services/authService";

import {
  AuthStackParamList,
} from "../../navigation/AuthNavigator";

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "VerifyForgotOtp"
  >;

const VerifyForgotOtpScreen =
  ({
    navigation,
    route,
  }: Props) => {
    const {
      email,
    } = route.params;

    const [
      countdown,
      setCountdown,
    ] = useState(30);

    const [
      isResending,
      setIsResending,
    ] = useState(false);

    const {
      control,
      handleSubmit,
      formState: {
        errors,
        isSubmitting,
      },
    } = useForm<
      VerifyForgotOtpFormData
    >({
      resolver:
        zodResolver(
          verifyForgotOtpSchema
        ),

      defaultValues: {
        otp: "",
      },
    });

    useEffect(() => {
      if (
        countdown === 0
      ) {
        return;
      }

      const timer =
        setInterval(() => {
          setCountdown(
            (
              prev
            ) =>
              prev -
              1
          );
        }, 1000);

      return () =>
        clearInterval(
          timer
        );
    }, [countdown]);

    const onSubmit = async (
  data: VerifyForgotOtpFormData
) => {
  try {
    const response =
      await verifyForgotOtp({
        email,
        otp: data.otp,
      });

    Toast.show({
      type: "success",
      text1: "OTP Verified",
      text2: response.message,
    });

    navigation.navigate(
      "ResetPassword",
      {
        email,
        otp: data.otp,
      }
    );
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Verification Failed",
      text2:
        error?.response?.data?.message ??
        "Something went wrong",
    });
  }
};

    const handleResend =
      async () => {
        try {
          setIsResending(
            true
          );

          const response =
            await forgotPassword(
              {
                email,
              }
            );

          Toast.show({
            type:
              "success",

            text1:
              "OTP Sent",

            text2:
              response.message,
          });

          setCountdown(
            30
          );
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Failed",
                text2:
                error?.response?.data?.message ??
                "Something went wrong",
            });
        } finally {
          setIsResending(
            false
          );
        }
      };

    return (
      <KeyboardAvoidingView
        style={
          verifyForgotOtpStyles.container
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
            verifyForgotOtpStyles.scrollContainer
          }
        >
          <AuthHeader
            title="Verify OTP"
            subtitle="Enter the OTP sent to your email"
          />

          <View
            style={
              verifyForgotOtpStyles.formContainer
            }
          >
            <Text
              style={
                verifyForgotOtpStyles.emailText
              }
            >
              {email}
            </Text>

            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <OtpInput
                  value={
                    field.value
                  }
                  onChange={(
                    otp
                  ) => {
                    field.onChange(
                      otp
                    );

                    if (
                      otp.length ===
                      6
                    ) {
                      handleSubmit(
                        onSubmit
                      )();
                    }
                  }}
                />
              )}
            />

            <CustomButton
              title="Verify OTP"
              loading={
                isSubmitting
              }
              onPress={handleSubmit(
                onSubmit
              )}
            />

            <TouchableOpacity
              disabled={
                countdown >
                  0 ||
                isResending
              }
              onPress={
                handleResend
              }
            >
              <Text
                style={[
                  verifyForgotOtpStyles.resendText,

                  countdown >
                    0 &&
                    verifyForgotOtpStyles.disabledText,
                ]}
              >
                {countdown >
                0
                  ? `Resend OTP in ${countdown}s`
                  : isResending
                  ? "Sending..."
                  : "Resend OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

export default VerifyForgotOtpScreen;