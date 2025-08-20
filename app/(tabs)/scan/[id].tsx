import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { View, Text, Button, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";

export default function ScanDetails() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{ id: string }>();
  const [scanData, setScanData] = useState<any>();
  const router = useRouter();

  const loadData = async () => {
    try {
      const data = await db.getAllAsync("SELECT * FROM food_items WHERE ean_id = ?", [params.id])
      setScanData(data[0])

    } catch (error) {
      console.error("Error loading data: ", error)
    }
  }

  const logScannedFoodItem = async () => {
    db.runAsync("INSERT INTO log_entries (food_item_id, date) VALUES (?,?)", [
      scanData.id,
      new Date().toISOString()
    ])
    Alert.alert(
      "Food Logged!",
      "",
      [
        {
          text: "OK",
          onPress: () => {
            router.back();
          }
        }
      ],
      { cancelable: false }
    );
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (!scanData) {
    return (
      <View />
    )
  }

  return (
    <View style={{ backgroundColor: 'white' }}>
      <Text>
        {params.id}
      </Text>
      <Text>
        {scanData.name}
      </Text>
      <Button onPress={logScannedFoodItem} title="Log Food" />
    </View>
  )
}
