import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, TextInput, Switch } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Image } from "expo-image";
import { EvilIcons } from "@expo/vector-icons";

export default function ScanDetails() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{ id: string }>();
  const [scanData, setScanData] = useState<any>();
  const [isUnit, setIsUnit] = useState<boolean>(false);
  const [servingAmount, setServingAmount] = useState<number>(1);
  const router = useRouter();

  const loadData = async () => {
    try {
      const data = await db.getAllAsync("SELECT * FROM food_items WHERE ean_id = ?", [params.id])
      setScanData(data[0])

    } catch (error) {
      console.error("Error loading data: ", error)
    }
  }

  const handleServingInput = (input: string) => {
    const numberServingAmount = Number(input);
    setServingAmount(numberServingAmount);
  }

  const logScannedFoodItem = async () => {
    await db.runAsync("INSERT INTO log_entries (food_item_id, date, log_serving) VALUES (?,?,?)", [
      scanData.id,
      new Date().toISOString(),
      isUnit ? servingAmount / scanData.serving_quantity : servingAmount
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
    <View style={styles.container}>
      <View style={styles.scanHeader}>
        <Image
          source={scanData.image_url}
          style={{ height: 100, width: 100, borderRadius: 20, overflow: 'hidden' }}
        />
        <View style={{ display: 'flex', gap: 10 }}>
          <Text>
            {scanData.name}
          </Text>
          <Text>
            {scanData.brand}
          </Text>
          <View style={{ width: '80%', display: 'flex', flexDirection: 'row', gap: 10 }}>
            <TextInput keyboardType={'numeric'} style={{ borderWidth: 1, width: 100, borderColor: 'black', borderRadius: 5, padding: 5 }} value={String(servingAmount)} onChangeText={(input) => handleServingInput(input)} />
            <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, backgroundColor: 'lightgray' }} onPress={() => setIsUnit(!isUnit)}>
              <Text>{isUnit ? `(${scanData.serving_unit}) amount` : "# of servings"}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, width: 130, backgroundColor: 'lightblue', padding: 5, borderRadius: 100 }} onPress={logScannedFoodItem}>
            <EvilIcons name="plus" size={20} />
            <Text>Log food</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Nutritional info</Text>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 35 }}>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <View style={styles.macrosWrapper}>
            <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{scanData.calories}</Text>
          </View>
          <Text>Calories</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <View style={styles.macrosWrapper}>
            <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{scanData.g_protein}</Text>
          </View>
          <Text>Protein (g)</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <View style={styles.macrosWrapper}>
            <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{scanData.g_carbs}</Text>
          </View>
          <Text>Carbs (g)</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <View style={styles.macrosWrapper}>
            <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{scanData.g_fats}</Text>
          </View>
          <Text>Fats (g)</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <View style={styles.macrosWrapper}>
            <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{scanData.g_fiber}</Text>
          </View>
          <Text>Fiber (g)</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <View style={styles.macrosWrapper}>
            <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{scanData.serving_quantity}</Text>
          </View>
          <Text>Serving ({scanData.serving_unit})</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10
  },
  scanHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 20,
  },
  caloriesWrapper: {
    padding: 30,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'lavender',
    justifyContent: 'center',
    gap: 5,
    display: 'flex',
    flexDirection: 'column'
  },
  macrosWrapper: {
    height: 100,
    width: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: 'lavender'
  },
});

