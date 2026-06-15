import React from "react";
import StudentTabNavigator from "./StudentTabNavigator";
import AdminTabNavigator from "./AdminTabNavigator";
import { useAuthStore } from "../store/authStore";

const AppNavigator = () => {
  const { user } = useAuthStore();

  if (user?.role === "admin") {
    return <AdminTabNavigator />;
  }

  return <StudentTabNavigator />;
};

export default AppNavigator;