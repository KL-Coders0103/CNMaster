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
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import Toast from "react-native-toast-message";

import AuthHeader from "../../components/AuthHeader";
import OtpInput from "../../components/OtpInput";
import CustomButton from "../../components/CustomButton";

import {
  verifyOtpStyles,
} from "../../styles/screens/verifyOtpStyles";

import {
  VerifyOtpFormData,
  verifyOtpSchema,
} from "../../utils/verifyOtpSchema";

import {
  resendOtp,
  verifyEmail,
} from "../../services/authService";

import {
  saveTokens,
} from "../../utils/secureStorage";

import {
  useAuthStore,
} from "../../store/authStore";

import {
  AuthStackParamList,
} from "../../navigation/AuthNavigator";

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "VerifyOtp"
  >;

const VerifyOtpScreen = ({
  navigation,
  route,
}: Props) => {
  const { email } =
    route.params;

  const [countdown, setCountdown] =
    useState(30);

  const [isResending, setIsResending] =
    useState(false);

  const setAuth =
    useAuthStore(
      (state) =>
        state.setAuth
    );

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<
    VerifyOtpFormData
  >({
    resolver:
      zodResolver(
        verifyOtpSchema
      ),

    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (countdown === 0) {
      return;
    }

    const timer =
      setInterval(() => {
        setCountdown(
          (prev) =>
            prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (
    data: VerifyOtpFormData
  ) => {
    try {
      const response =
        await verifyEmail({
          email,
          otp: data.otp,
        });

      await saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.user
      );

      setAuth(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.user
      );

      Toast.show({
        type: "success",
        text1: "Email Verified",
        text2: response.message,
      });

      navigation.replace(
        "CompleteProfile"
      );
    } catch (
      error: any
    ) {
      Toast.show({
        type: "error",
        text1:
          "Verification Failed",

        text2:
          error?.response
            ?.data
            ?.message ??
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
          await resendOtp({
            email,
          });

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
      } catch (
        error: any
      ) {
        Toast.show({
          type:
            "error",

          text1:
            "Resend Failed",

          text2:
            error?.response
              ?.data
              ?.message ??
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
        verifyOtpStyles.container
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
          verifyOtpStyles.scrollContainer
        }
      >
        <AuthHeader
          title="Verify OTP"
          subtitle="Enter the OTP sent to your email"
        />

        <View
          style={
            verifyOtpStyles.formContainer
          }
        >
          <Text
            style={
              verifyOtpStyles.infoText
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
                verifyOtpStyles.resendText,

                countdown >
                  0 &&
                  verifyOtpStyles.disabledText,
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

export default VerifyOtpScreen;