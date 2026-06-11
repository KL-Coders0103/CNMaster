import auth from "@react-native-firebase/auth";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useAuthStore } from "../store/authStore";
import { saveTokens } from "../utils/secureStorage";
import { googleLogin } from "./authService";

GoogleSignin.configure({
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export const signInWithGoogle =
  async () => {
    try {
      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signOut();

      const userInfo =
        await GoogleSignin.signIn();

      console.log(
        "USER INFO:",
        JSON.stringify(
          userInfo,
          null,
          2
        )
      );

      const idToken =
        userInfo.data?.idToken;

      if (!idToken) {
        throw new Error(
          "Google ID Token not found"
        );
      }

      const googleCredential =
        auth.GoogleAuthProvider.credential(
          idToken
        );

      const firebaseUser =
      await auth().signInWithCredential(
        googleCredential
      );

    console.log(
      "FIREBASE USER:",
      firebaseUser.user
    );

    const firebaseIdToken =
      await firebaseUser.user.getIdToken();

    const response =
      await googleLogin({
        idToken: firebaseIdToken
      });

    await saveTokens(
      response.data.accessToken,
      response.data.refreshToken,
      response.data.user
    );

    useAuthStore
      .getState()
      .setAuth(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.user
      );

    return response.data.user;
      
    } catch (error: any) {
      console.log(
        "GOOGLE AUTH ERROR:",
        JSON.stringify(
          error,
          null,
          2
        )
      );

      if (
  error.code ===
  statusCodes.SIGN_IN_CANCELLED
) {
  return null;
}

      if (
        error.code ===
        statusCodes.IN_PROGRESS
      ) {
        throw new Error(
          "Sign in already in progress"
        );
      }

      if (
        error.code ===
        statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        throw new Error(
          "Google Play Services unavailable"
        );
      }

      throw error;
    }
  };