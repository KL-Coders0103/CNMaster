import React, { useState } from "react";
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

import AuthHeader from "../../components/AuthHeader";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

import {
  completeProfileSchema,
  CompleteProfileFormData,
} from "../../utils/completeProfileSchema";

import {
  completeProfileStyles,
} from "../../styles/screens/completeProfileStyles";

import {
  completeProfile,
} from "../../services/authService";

import {
  useAuthStore,
} from "../../store/authStore";

const CompleteProfileScreen = () => {

  const {
  user,
  accessToken,
  refreshToken,
  setAuth,
} = useAuthStore();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  const isGoogleUser =
    user?.provider ===
    "google";

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<
    CompleteProfileFormData
  >({
    resolver:
      zodResolver(
        completeProfileSchema
      ),

    defaultValues: {
  mobileNumber:
    user?.mobileNumber ?? "",

  password: "",

  confirmPassword:
    "",

  year:
    user?.year ?? "",

  branch:
    user?.branch ?? "",

  section:
    user?.section ?? "",

  isGoogleUser,
},
  });
  console.log("Form error:", errors);

  const onSubmit = async (
    data: CompleteProfileFormData
  ) => {
    console.log("complete profile submit", data);
    try {
      const payload = {
  mobileNumber:
    data.mobileNumber ||
    undefined,

  password:
    data.password ||
    undefined,

  year: data.year,

  branch: data.branch,

  section: data.section,
};

const response =
  await completeProfile(
    payload,
    accessToken!
  );

setAuth(
  accessToken!,
  refreshToken!,
  response.data.user
);

Toast.show({
  type: "success",
  text1:
    "Profile Completed",
});

      /*
 RootNavigator will automatically
 move user to AppNavigator
 because isProfileCompleted
 becomes true.
*/

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
        completeProfileStyles.container
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
          completeProfileStyles.scrollContainer
        }
      >
        <View
          style={
            completeProfileStyles.headerContainer
          }
        >
          <View
            style={
              completeProfileStyles.badge
            }
          >
            <Text
              style={
                completeProfileStyles.badgeText
              }
            >
              CN MASTER
            </Text>
          </View>

          <Text
            style={
              completeProfileStyles.title
            }
          >
            Complete{"\n"}
            your profile
          </Text>

          <Text
            style={
              completeProfileStyles.subtitle
            }
          >
            Help us personalize
            your learning journey
            by sharing your
            academic details.
          </Text>
        </View>

        <View
          style={
            completeProfileStyles.formContainer
          }
        >

          {
            isGoogleUser && (
              <>
                <Controller
                  control={control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <CustomInput
                      label="Mobile Number"
                      placeholder="Enter mobile number"
                      value={field.value}
                      onChangeText={
                        field.onChange
                      }
                      keyboardType="number-pad"
                      error={
                        errors
                          .mobileNumber
                          ?.message
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
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
              </>
            )
          }

          <Controller
            control={
              control
            }
            name="year"
            render={({
              field,
            }) => (
              <CustomInput
                label="Academic Year"
                placeholder="1st / 2nd / 3rd / 4th Year"
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                error={
                  errors.year
                    ?.message
                }
              />
            )}
          />

          <Controller
            control={
              control
            }
            name="branch"
            render={({
              field,
            }) => (
              <CustomInput
                label="Branch"
                placeholder="CSE / IT / AIDS / AIML"
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                error={
                  errors.branch
                    ?.message
                }
              />
            )}
          />

          <Controller
            control={
              control
            }
            name="section"
            render={({
              field,
            }) => (
              <CustomInput
                label="Section"
                placeholder="A / B / C / D"
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                error={
                  errors.section
                    ?.message
                }
              />
            )}
          />

          <CustomButton
            title="Complete Profile"
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

export default CompleteProfileScreen;