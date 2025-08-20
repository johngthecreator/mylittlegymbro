import { useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
export default function foodInfo() {
  const data = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ backgroundColor: 'white' }}>
      <Text>Food info page {data.id}</Text>
    </View>
  )
}
