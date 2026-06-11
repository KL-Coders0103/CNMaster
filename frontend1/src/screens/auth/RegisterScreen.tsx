import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

import { registerStyles } from "../../styles/screens/registerStyles";
import {
  registerSchema,
  RegisterFormData,
} from "../../utils/registerSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import PasswordStrengthIndicator from "../../components/PasswordStrenghtIndicator";
import { useAuthStore } from "../../store/authStore";
import {registerUser } from "../../services/authService";
import { signInWithGoogle } from "../../services/googleAuthService";

type Props = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;

const RegisterScreen = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const setAuth =
  useAuthStore(
    (state) => state.setAuth
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      const response = await registerUser({
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        mobileNumber: data.mobileNumber.trim(),
        password: data.password,
      });

      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2:
          response.message ||
          "OTP sent successfully",
      });

      navigation.navigate("VerifyOtp", {
        email: data.email,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong";

      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: message,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={registerStyles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          registerStyles.scrollContainer
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={
            registerStyles.headerContainer
          }
        >
          <View
            style={
              registerStyles.badge
            }
          >
            <Text
              style={
                registerStyles.badgeText
              }
            >
              CN MASTER
            </Text>
          </View>

          <Text
            style={
              registerStyles.title
            }
          >
            Create your{"\n"}
            account
          </Text>

          <Text
            style={
              registerStyles.subtitle
            }
          >
            Start mastering
            Computer Networks
            with interactive
            learning experiences.
          </Text>
        </View>

        <View style={registerStyles.formContainer}>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <CustomInput
                label="Full Name"
                placeholder="Enter full name"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <CustomInput
                label="Email"
                placeholder="Enter email"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="mobileNumber"
            render={({ field }) => (
              <CustomInput
                label="Mobile Number"
                placeholder="Enter mobile number"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="phone-pad"
                maxLength={10}
                error={
                  errors.mobileNumber?.message
                }
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <>
                <CustomInput
                  label="Password"
                  placeholder="Create password"
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
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <CustomInput
                label="Confirm Password"
                placeholder="Confirm password"
                value={field.value}
                onChangeText={field.onChange}
                secureTextEntry={
                  !showConfirmPassword
                }
                error={
                  errors.confirmPassword
                    ?.message
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
              />
            )}
          />

          <CustomButton
            title="Create Account"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={() => handleSubmit(onSubmit)()}
          />

          <View
            style={
              registerStyles.dividerContainer
            }
          >
            <View
              style={
                registerStyles.divider
              }
            />

            <Text
              style={
                registerStyles.dividerText
              }
            >
              OR
            </Text>

            <View
              style={
                registerStyles.divider
              }
            />
          </View>

          <TouchableOpacity
            style={registerStyles.googleButton}
            onPress={async () => {
              try {
                const user =
                  await signInWithGoogle();

                if (!user) {
                  return;
                }

                const authUser =
                  useAuthStore.getState().user;

                Toast.show({
                  type: "success",
                  text1:
                    "Google Sign In Successful",
                });

                if (
                  authUser?.isProfileCompleted
                ) {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "App" as never,
                      },
                    ],
                  });
                } else {
                  navigation.navigate(
                    "CompleteProfile"
                  );
                }
              } catch (error: any) {
                Toast.show({
                  type: "error",
                  text1:
                    "Google Sign In Failed",
                  text2:
                    error?.message ??
                    "Something went wrong",
                });
              }
            }}
          >
            <Text
              style={
                registerStyles.googleButtonText
              }
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Login")
            }
          >
            <Text
              style={
                registerStyles.loginText
              }
            >
              Already have an account?
              {" "}

              <Text
                style={
                  registerStyles.loginLink
                }
              >
                Login
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;