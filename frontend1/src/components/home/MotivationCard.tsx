import React from "react";

import {
  View,
  Text,
} from "react-native";

import {
  motivationCardStyles,
} from "../../styles/components/home/motivationCardStyles";

const quotes = [
  {
    text:
      "Success is the sum of small efforts repeated day in and day out.",
    author:
      "Robert Collier",
  },
  {
    text:
      "The expert in anything was once a beginner.",
    author:
      "Helen Hayes",
  },
  {
    text:
      "Push yourself because no one else is going to do it for you.",
    author:
      "Unknown",
  },
];

const MotivationCard = () => {
  const today =
    new Date().getDate();

  const quote =
    quotes[
      today % quotes.length
    ];

  return (
    <View
      style={
        motivationCardStyles.motivationCard
      }
    >
      <Text
        style={
          motivationCardStyles.sectionTitle
        }
      >
        Daily Motivation
      </Text>

      <Text
        style={
          motivationCardStyles.quoteText
        }
      >
        "{quote.text}"
      </Text>

      <Text
        style={
          motivationCardStyles.quoteAuthor
        }
      >
        — {quote.author}
      </Text>
    </View>
  );
};

export default MotivationCard;