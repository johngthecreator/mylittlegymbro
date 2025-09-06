import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import { ILogEntryWithFoodItem } from "@/core/interfaces";
import { ISummaryController } from "@/core/summary/summary.interface";
import { TYPES } from "@/core/types";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Container } from "inversify";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";

function FoodInfo({ container }: { container: Container }) {
  const { id, timestamp } = useLocalSearchParams<{
    id: string;
    timestamp: string;
  }>();
  const colorScheme = useColorScheme();
  const [logEntry, setLogEntry] = useState<ILogEntryWithFoodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchLogEntry = async () => {
      try {
        setLoading(true);
        setError(undefined);
        if (id && timestamp) {
          const summaryController = container.get<ISummaryController>(
            TYPES.ISummaryController
          );
          const entry = await summaryController.getLogEntryById(
            parseInt(id),
            timestamp
          );
          setLogEntry(entry);
        }
      } catch (err) {
        console.error("Failed to fetch log entry:", err);
        setError("Failed to load food information.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogEntry();
  }, [id, timestamp]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].text}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
          {error}
        </Text>
      </View>
    );
  }

  if (!logEntry) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
          Log entry not found.
        </Text>
      </View>
    );
  }

  const servingGrams =
    (logEntry.log_serving / (logEntry.serving_quantity || 1)) * 100;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
        padding: 20,
      }}
    >
      <Stack.Screen
        options={{ title: logEntry.name, headerShadowVisible: false }}
      />
      <Text
        style={{
          color: Colors[colorScheme ?? "light"].text,
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        {logEntry.name}
      </Text>
      <Text
        style={{
          color: Colors[colorScheme ?? "light"].text,
          fontSize: 18,
          marginBottom: 5,
        }}
      >
        Logged Grams: {servingGrams.toFixed(2)}g
      </Text>
      <Text
        style={{
          color: Colors[colorScheme ?? "light"].text,
          fontSize: 18,
          marginBottom: 5,
        }}
      >
        Calories: {(logEntry.calories * logEntry.log_serving).toFixed(2)} kcal
      </Text>
      <Text
        style={{
          color: Colors[colorScheme ?? "light"].text,
          fontSize: 18,
          marginBottom: 5,
        }}
      >
        Protein: {(logEntry.g_protein * logEntry.log_serving).toFixed(2)}g
      </Text>
      <Text
        style={{
          color: Colors[colorScheme ?? "light"].text,
          fontSize: 18,
          marginBottom: 5,
        }}
      >
        Carbs: {(logEntry.g_carbs * logEntry.log_serving).toFixed(2)}g
      </Text>
      <Text
        style={{
          color: Colors[colorScheme ?? "light"].text,
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        Fats: {(logEntry.g_fats * logEntry.log_serving).toFixed(2)}g
      </Text>

      <Link href={`/scan/${logEntry.food_item_id}`} asChild>
        <Pressable>
          {({ pressed }) => (
            <Text
              style={{
                color: Colors[colorScheme ?? "light"].tint,
                textDecorationLine: "underline",
                opacity: pressed ? 0.5 : 1,
              }}
            >
              View Food Item Details
            </Text>
          )}
        </Pressable>
      </Link>
    </View>
  );
}

export default withContainer(FoodInfo);
