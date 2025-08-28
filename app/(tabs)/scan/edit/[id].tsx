import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { View, Text, Alert, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Image } from "expo-image";

export default function EditScanDetails() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{ id: string }>();
  const [scanData, setScanData] = useState<any>();
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fats, setFats] = useState<string>('');
  const [fiber, setFiber] = useState<string>('');
  const [sodium, setSodium] = useState<string>('');
  const [servingQuantity, setServingQuantity] = useState<string>('');
  const [servingUnit, setServingUnit] = useState<string>('');

  const router = useRouter();

  const loadData = async () => {
    try {
      const data = await db.getAllAsync("SELECT * FROM food_items WHERE ean_id = ?", [params.id]);
      const foodItem = data[0];
      setScanData(foodItem);
      setName(foodItem.name);
      setBrand(foodItem.brand);
      setCalories(String(foodItem.calories));
      setProtein(String(foodItem.g_protein));
      setCarbs(String(foodItem.g_carbs));
      setFats(String(foodItem.g_fats));
      setFiber(String(foodItem.g_fiber));
      setSodium(String(foodItem.g_sodium));
      setServingQuantity(String(foodItem.serving_quantity));
      setServingUnit(foodItem.serving_unit);
    } catch (error) {
      console.error("Error loading data: ", error);
    }
  };

  const saveFoodItemDetails = async () => {
    try {
      await db.runAsync(
        "UPDATE food_items SET name = ?, brand = ?, calories = ?, g_protein = ?, g_carbs = ?, g_fats = ?, g_fiber = ?, g_sodium = ?, serving_quantity = ?, serving_unit = ? WHERE ean_id = ?",
        [
          name,
          brand,
          Number(calories),
          Number(protein),
          Number(carbs),
          Number(fats),
          Number(fiber),
          Number(sodium),
          Number(servingQuantity),
          servingUnit,
          params.id
        ]
      );
      Alert.alert(
        "Saved!",
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
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (!scanData) {
    return <View />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.scanHeader}>
              <Image
                source={scanData.image_url}
                style={{ height: 100, width: 100, borderRadius: 20, overflow: 'hidden' }}
              />
              <View style={{ display: 'flex', gap: 10, width: '70%' }}>
                <TextInput style={{ flexWrap: 'wrap', borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, padding: 5 }} value={name} onChangeText={setName} />
                <TextInput style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, padding: 5 }} value={brand} onChangeText={setBrand} />
                <View style={{ width: '80%', display: 'flex', flexDirection: 'row', gap: 10 }}>
                  <TextInput keyboardType={'numeric'} style={{ borderWidth: 1, width: 100, borderColor: 'black', borderRadius: 5, padding: 5 }} value={servingQuantity} onChangeText={setServingQuantity} />
                  <TextInput style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: 'lightgray' }} value={servingUnit} onChangeText={setServingUnit} />
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Nutritional info</Text>
            <View style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#F5F4F6', padding: 15, gap: 10, borderRadius: 20 }}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
                <Text>Total calories</Text>
                <TextInput keyboardType={'numeric'} style={styles.input} value={calories} onChangeText={setCalories} />
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
                <Text>Protein (g)</Text>
                <TextInput keyboardType={'numeric'} style={styles.input} value={protein} onChangeText={setProtein} />
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
                <Text>Carbs (g)</Text>
                <TextInput keyboardType={'numeric'} style={styles.input} value={carbs} onChangeText={setCarbs} />
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
                <Text>Fats (g)</Text>
                <TextInput keyboardType={'numeric'} style={styles.input} value={fats} onChangeText={setFats} />
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 10, borderColor: 'lightgray' }}>
                <Text>Fiber (g)</Text>
                <TextInput keyboardType={'numeric'} style={styles.input} value={fiber} onChangeText={setFiber} />
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Sodium (g)</Text>
                <TextInput keyboardType={'numeric'} style={styles.input} value={sodium} onChangeText={setSodium} />
              </View>
            </View>
            <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, width: 'auto', backgroundColor: 'lightblue', padding: 10, marginTop: 20, borderRadius: 100 }} onPress={saveFoodItemDetails}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inner: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-around',
  },
  scanHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 5,
    width: 100,
    textAlign: 'right'
  }
});
