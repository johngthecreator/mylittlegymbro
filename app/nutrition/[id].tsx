import { useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
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
  return (
    <View style={{ backgroundColor: 'white' }}>
      <Text>Food info page {data.id}</Text>
    </View>
  )
}


