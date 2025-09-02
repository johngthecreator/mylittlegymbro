import { useLocalSearchParams } from "expo-router"
import { View, Text, useColorScheme } from "react-native"
import { Colors } from "@/constants/Colors";

/**
 * React Native screen that displays basic information for a food item.
 *
 * Reads the `id` from the router's local search parameters and renders a simple view
 * showing "Food info page <id>".
 *
 * The component does not perform loading/error handling or fetch additional data.
 *
 * @returns A React element representing the food info screen.
 */
export default function foodInfo() {
  const data = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  return (
    <View style={{ backgroundColor: Colors[colorScheme ?? 'light'].background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Food info page {data.id}</Text>
    </View>
  )
}


