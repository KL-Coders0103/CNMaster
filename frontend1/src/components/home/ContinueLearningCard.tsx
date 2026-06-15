import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { continueLearningCardStyles } from "../../styles/components/home/continueLearningCardStyles";
import { useDashboardStore } from "../../store/dashboardStore";

const ContinueLearningCard =
  () => {
    const dashboard =
      useDashboardStore(
        state => state.dashboard
      );

    const continueLearning =
      dashboard?.continueLearning;

    const hasProgress =
      !!continueLearning;

    if (!hasProgress) {
      return (
        <View
          style={
            continueLearningCardStyles.continueCard
          }
        >
          <Text
            style={
              continueLearningCardStyles.sectionTitle
            }
          >
            Start Learning
          </Text>

          <Text>
            You haven't started
            yet.
          </Text>

          <TouchableOpacity>
            <Text
              style={
                continueLearningCardStyles.resumeText
              }
            >
              Start First Topic →
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View
        style={
          continueLearningCardStyles.continueCard
        }
      >
        <Text
          style={
            continueLearningCardStyles.sectionTitle
          }
        >
          Continue Learning
        </Text>

        <Text
          style={
            continueLearningCardStyles.topicTitle
          }
        >
          {continueLearning?.moduleName}
        </Text>

        <Text
          style={
            continueLearningCardStyles.progressLabel
          }
        >
          {continueLearning?.progress}% Completed
        </Text>

        <View
          style={
            continueLearningCardStyles.progressBar
          }
        >
          <View
            style={
              continueLearningCardStyles.progressFill
            }
          />
        </View>

        <TouchableOpacity
          style={
            continueLearningCardStyles.resumeButton
          }
        >
          <Text
            style={
              continueLearningCardStyles.resumeText
            }
          >
            Resume Learning
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#2563EB"
          />
        </TouchableOpacity>
      </View>
    );
  };

export default ContinueLearningCard;