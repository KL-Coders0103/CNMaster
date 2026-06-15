import { getAuth, GoogleAuthProvider, signInWithCredential, getIdToken } from "@react-native-firebase/auth";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useAuthStore } from "../store/authStore";
import { saveTokens } from "../utils/secureStorage";
import { googleLogin } from "./authService";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut(); 

    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error("Google ID Token not found");
    }

    const authInstance = getAuth();
    const googleCredential = GoogleAuthProvider.credential(idToken);
  
    const firebaseUser = await signInWithCredential(authInstance, googleCredential);
    const firebaseIdToken = await getIdToken(firebaseUser.user);

    const response = await googleLogin({
      idToken: firebaseIdToken,
    });

    await saveTokens(
      response.data.accessToken,
      response.data.refreshToken,
      response.data.user
    );

    useAuthStore.getState().setAuth(
      response.data.accessToken,
      response.data.refreshToken,
      response.data.user
    );

    return response.data.user;

  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return null; 
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error("Sign in already in progress");
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error("Google Play Services unavailable");
    }
    throw error;
  }
};