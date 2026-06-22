import React from "react";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import QuizDashboardScreen
from "../screens/quiz/QuizDashboardScreen";

import QuizInstructionsScreen
from "../screens/quiz/QuizInstructionsScreen";

import QuizScreen
from "../screens/quiz/QuizScreen";

import QuizResultScreen
from "../screens/quiz/QuizResultScreen";

import QuizHistoryScreen
from "../screens/quiz/QuizHistoryScreen";
import QuizReviewScreen from "../screens/quiz/QuizReviewScreen";

export type QuizStackParamList = {

  QuizDashboard: undefined;

  QuizInstructions: {
    chapterId: string;
    difficulty:
      "EASY" |
      "MEDIUM" |
      "HARD";
  };

  Quiz: {
    attemptId: string;
    questions: any[];
  };

  QuizResult: {
    attemptId: string;
  };

  QuizHistory: undefined;

  QuizReview: {
    attemptId: string;
  };
};

const Stack =
  createNativeStackNavigator<QuizStackParamList>();

const QuizStackNavigator =
  () => {

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen
          name="QuizDashboard"
          component={
            QuizDashboardScreen
          }
        />

        <Stack.Screen
          name="QuizInstructions"
          component={
            QuizInstructionsScreen
          }
        />

        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
        />

        <Stack.Screen
          name="QuizResult"
          component={
            QuizResultScreen
          }
        />

        <Stack.Screen
          name="QuizHistory"
          component={
            QuizHistoryScreen
          }
        />

        <Stack.Screen
            name="QuizReview"
            component={QuizReviewScreen}
        />

      </Stack.Navigator>
    );
  };

export default QuizStackNavigator;