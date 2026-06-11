import React from "react";
import Toast from "react-native-toast-message";

import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <>
      <RootNavigator />
      <Toast />
    </>
  );
}