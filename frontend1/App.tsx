import React from "react";
import Toast from "react-native-toast-message";

import RootNavigator from "./src/navigation/RootNavigator";
import { toastConfig } from "./src/utils/toastConfig";

export default function App() {
  return (
    <>
      <RootNavigator />
      <Toast config={toastConfig} />
    </>
  );
}