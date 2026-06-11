import React from "react";

import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "react-native-toast-message";

import {
  logoutUser,
  logoutAllDevices,
} from "../../services/authService";

import {
  getTokens,
  clearTokens,
} from "../../utils/secureStorage";

import {
  useAuthStore,
} from "../../store/authStore";
import { CommonActions, useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const clearAuth =
    useAuthStore(
      (state) =>
        state.clearAuth
    );

  const handleLogout =
    async () => {
      try {
        Alert.alert(
          "Logout",
          "Are you sure?",
          [
            {
              text:
                "Cancel",
              style:
                "cancel",
            },

            {
              text:
                "Logout",

              onPress:
                async () => {
                  try {
                    const {
                      refreshToken,
                    } =
                      await getTokens();

                    if (
                      refreshToken
                    ) {
                      await logoutUser(
                        {
                          refreshToken,
                        }
                      );
                    }

                    await clearTokens();

                    clearAuth();

                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                            {
                                name: "Auth" as never,
                            },
                            ],
                        })
                    );

                    Toast.show({
                      type:
                        "success",

                      text1:
                        "Logged Out",
                    });
                  } catch (
                    error: any
                  ) {
                    Toast.show({
                      type:
                        "error",

                      text1:
                        "Logout Failed",

                      text2:
                        error
                          ?.response
                          ?.data
                          ?.message ??
                        "Something went wrong",
                    });
                  }
                },
            },
          ]
        );
      } catch {}
    };

  const handleLogoutAll =
    async () => {
      try {
        Alert.alert(
          "Logout All Devices",
          "Logout from all devices?",
          [
            {
              text:
                "Cancel",
              style:
                "cancel",
            },

            {
              text:
                "Logout",

              onPress:
                async () => {
                  try {
                    await logoutAllDevices();

                    await clearTokens();

                    clearAuth();

                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                            {
                                name: "Auth" as never,
                            },
                            ],
                        })
                    );

                    Toast.show({
                      type:
                        "success",

                      text1:
                        "Logged Out From All Devices",
                    });
                  } catch (
                    error: any
                  ) {
                    Toast.show({
                      type:
                        "error",

                      text1:
                        "Failed",

                      text2:
                        error
                          ?.response
                          ?.data
                          ?.message ??
                        "Something went wrong",
                    });
                  }
                },
            },
          ]
        );
      } catch {}
    };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <View
        style={{
          gap: 16,
        }}
      >
        <TouchableOpacity
          onPress={
            handleLogout
          }
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor:
              "#EF4444",
          }}
        >
          <Text
            style={{
              color:
                "#FFFFFF",

              fontWeight:
                "700",

              textAlign:
                "center",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            handleLogoutAll
          }
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor:
              "#DC2626",
          }}
        >
          <Text
            style={{
              color:
                "#FFFFFF",

              fontWeight:
                "700",

              textAlign:
                "center",
            }}
          >
            Logout All Devices
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;