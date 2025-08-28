import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
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

  const dismissInput = () => {
    Keyboard.dismiss(); // Hides the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={dismissInput}>
      <View style={styles.container}>
        <View style={styles.scanHeader}>
          <Image
            source={scanData.image_url}
            style={{ height: 100, width: 100, borderRadius: 20, overflow: 'hidden' }}
          />
          <View style={{ display: 'flex', gap: 10, width: '70%' }}>
            <Text style={{ flexWrap: 'wrap' }}>
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
          </View>
        </View>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Nutritional info</Text>
        <View style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#F5F4F6', padding: 15, gap: 10, borderRadius: 20 }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
            <Text>Total calories</Text>
            <Text>{Math.round((scanData.calories || 0) * (
              isUnit ? servingAmount / scanData.serving_quantity : servingAmount
            ) * 100) / 100}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
            <Text>Protein (g)</Text>
            <Text>{Math.round((scanData.g_protein || 0) * (
              isUnit ? servingAmount / scanData.serving_quantity : servingAmount
            ) * 100) / 100}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
            <Text>Carbs (g)</Text>
            <Text>{Math.round((scanData.g_carbs || 0) * (
              isUnit ? servingAmount / scanData.serving_quantity : servingAmount
            ) * 100) / 100}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
            <Text>Fats (g)</Text>
            <Text>{Math.round((scanData.g_fats || 0) * (
              isUnit ? servingAmount / scanData.serving_quantity : servingAmount
            ) * 100) / 100}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
            <Text>Fiber (g)</Text>
            <Text>{Math.round((scanData.g_fiber || 0) * (
              isUnit ? servingAmount / scanData.serving_quantity : servingAmount
            ) * 100) / 100}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Sodium (g)</Text>
            <Text>{Math.round((scanData.g_sodium || 0) * (
              isUnit ? servingAmount / scanData.serving_quantity : servingAmount
            ) * 100) / 100}</Text>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 20 }}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, flex: 1, backgroundColor: 'lightblue', padding: 10, borderRadius: 100 }} onPress={logScannedFoodItem}>
            <EvilIcons name="plus" size={20} />
            <Text>Log food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, flex: 1, backgroundColor: 'lightgray', padding: 10, borderRadius: 100 }} onPress={() => router.push(`/scan/edit/${params.id}`)}>
            <EvilIcons name="pencil" size={20} />
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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

