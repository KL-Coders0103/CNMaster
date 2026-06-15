import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { weakAreasCardStyles } from "../../styles/components/home/weakAreasCardStyles";



const weakAreas = [
  "Subnetting",
  "DNS",
  "TCP/IP",
  "Routing",
];

const WeakAreasCard = () => {
  return (
    <View
      style={
        weakAreasCardStyles.weakAreasCard
      }
    >
      <Text
        style={
          weakAreasCardStyles.sectionTitle
        }
      >
        Weak Areas
      </Text>

      <Text
        style={
          weakAreasCardStyles.weakAreaSubtitle
        }
      >
        Focus on improving these topics.
      </Text>

      <View
        style={
          weakAreasCardStyles.chipsContainer
        }
      >
        {weakAreas.map(
          topic => (
            <TouchableOpacity
              key={topic}
              style={
                weakAreasCardStyles.chip
              }
            >
              <Text
                style={
                  weakAreasCardStyles.chipText
                }
              >
                {topic}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

export default WeakAreasCard;