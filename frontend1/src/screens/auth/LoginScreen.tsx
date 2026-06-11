import React, {
  useState,
} from "react";

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
  loginStyles,
} from "../../styles/screens/loginStyles";

import {
  loginSchema,
  LoginFormData,
} from "../../utils/loginSchema";

import {
  loginUser,
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
import { signInWithGoogle } from "../../services/googleAuthService";

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "Login"
  >;

const LoginScreen = ({
  navigation,
}: Props) => {
  const [showPassword,
    setShowPassword] =
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
    LoginFormData
  >({
    resolver:
      zodResolver(
        loginSchema
      ),

    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit =
    async (
      data: LoginFormData
    ) => {
      try {
        const response =
          await loginUser(
            data
          );

        await saveTokens(
          response.data
            .accessToken,

          response.data
            .refreshToken,

          response.data.user
        );

        setAuth(
          response.data
            .accessToken,

          response.data
            .refreshToken,

          response.data
            .user
        );

        Toast.show({
          type:
            "success",

          text1:
            "Welcome Back",

          text2:
            response.message,
        });

        /*
        Student/Admin Routing
        */
      } catch (
        error: any
      ) {
        Toast.show({
          type:
            "error",

          text1:
            "Login Failed",

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
        loginStyles.container
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
          loginStyles.scrollContainer
        }
      >
        <View
          style={
            loginStyles.headerContainer
          }
        >
          <View
            style={
              loginStyles.badge
            }
          >
            <Text
              style={
                loginStyles.badgeText
              }
            >
              CN MASTER
            </Text>
          </View>

          <Text
            style={
              loginStyles.title
            }
          >
            Welcome{"\n"}
            back
          </Text>

          <Text
            style={
              loginStyles.subtitle
            }
          >
            Continue your learning
            journey and master
            Computer Networks.
          </Text>
        </View>

        <View
          style={
            loginStyles.formContainer
          }
        >
          <Controller
            control={
              control
            }
            name="identifier"
            render={({
              field,
            }) => (
              <CustomInput
                label="Email or Mobile"
                placeholder="Enter email or mobile"
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                autoCapitalize="none"
                error={
                  errors
                    .identifier
                    ?.message
                }
              />
            )}
          />

          <Controller
            control={
              control
            }
            name="password"
            render={({
              field,
            }) => (
              <CustomInput
                label="Password"
                placeholder="Enter password"
                value={
                  field.value
                }
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
                  errors
                    .password
                    ?.message
                }
              />
            )}
          />

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "ForgotPassword"
              )
            }
          >
            <Text
              style={
                loginStyles.forgotPasswordText
              }
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            loading={
              isSubmitting
            }
            onPress={handleSubmit(
              onSubmit
            )}
          />

          <View
            style={
              loginStyles.dividerContainer
            }
          >
            <View
              style={
                loginStyles.divider
              }
            />

            <Text
              style={
                loginStyles.dividerText
              }
            >
              OR
            </Text>

            <View
              style={
                loginStyles.divider
              }
            />
          </View>

          <TouchableOpacity
            style={
              loginStyles.googleButton
            }
            onPress={async () => {
              try {
                const user =
                  await signInWithGoogle();

                if (!user) {
                  return;
                }

                const authUser =
                  useAuthStore
                    .getState()
                    .user;

                if (
                  authUser
                    ?.isProfileCompleted
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

                Toast.show({
                  type: "success",
                  text1:
                    "Google Login Successful",
                });
              } catch (
                error: any
              ) {
                Toast.show({
                  type: "error",
                  text1:
                    "Google Login Failed",
                  text2:
                    error?.message ??
                    "Something went wrong",
                });
              }
            }}
          >
            <Text
              style={
                loginStyles.googleButtonText
              }
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "Register"
              )
            }
          >
            <Text
              style={
                loginStyles.registerText
              }
            >
              Don't have an account?
              {" "}

              <Text
                style={
                  loginStyles.registerLink
                }
              >
                Register
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;