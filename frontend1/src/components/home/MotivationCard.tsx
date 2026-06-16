import React from "react";
import { View, Text } from "react-native";
import { getMotivationCardStyles } from "../../styles/components/home/motivationCardStyles";
import { useThemeStore } from "../../store/themeStore";

const quotes = [
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "Push yourself because no one else is going to do it for you.",
    author: "Unknown",
  },
];

const MotivationCard = () => {
  const { colors } = useThemeStore();
  const styles = getMotivationCardStyles(colors);
  
  const today = new Date().getDate();
  const quote = quotes[today % quotes.length];

  return (
    <View style={styles.motivationCard}>
      <Text style={styles.sectionTitle}>Daily Motivation</Text>
      <Text style={styles.quoteText}>"{quote.text}"</Text>
      <Text style={styles.quoteAuthor}>— {quote.author}</Text>
    </View>
  );
};

export default MotivationCard;