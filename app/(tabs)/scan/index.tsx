import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useCallback } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

interface Nutriments {
  "energy-kcal": number; // in kcal [cite: 78]
  proteins: number; // in grams [cite: 80]
  carbohydrates: number; // in grams [cite: 77]
  fat: number; // in grams [cite: 78]
  fiber: number; // in grams [cite: 79]
  sodium: number; // in milligrams [cite: 81]
}

interface Product {
  brands: string; // The brand name of the product [cite: 3]
  product_name: string; // The name of the product [cite: 107]
  image_small_url: string;
  nutriments: Nutriments; // Nested object containing nutritional facts
}

interface FoodDataResponse {
  product: Product;
}

/**
 * React Native screen that uses the device camera to scan barcodes and open a scanned food item's detail view.
 *
 * Renders a camera view (when permission is granted and the screen is focused), debounces duplicate/rapid scans,
 * checks the local SQLite `food_items` table for an existing entry by EAN barcode, and if not present fetches product
 * data from the Open Food Facts API and inserts a new row. On successful lookup or insertion the component navigates
 * to `/scan/[id]` using the scanned barcode as `id`. If the remote lookup or insert fails an alert is shown.
 *
 * Behavior notes:
 * - Prevents duplicate handling by ignoring scans within 500ms, repeated scans of the same barcode, or while a lookup
 *   is already in progress.
 * - Stores the API-provided `image_small_url` into the database `image_url` column when inserting a new item.
 * - Only renders the camera while the screen is focused.
 *
 * Side effects:
 * - Reads from and writes to the app's SQLite database.
 * - Performs network requests to Open Food Facts.
 * - Navigates via the app router and may display an Alert on error.
 *
 * Returns:
 * - A React element for the scanner screen.
 */
export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const lastScanTimeRef = useRef(0);
  const searching = useRef(false);
  const lastScanned = useRef("");
  const db = useSQLiteContext();
  const router = useRouter();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      lastScanned.current = "";
    }, [])
  )


  const handleBarCodeScanned = async (data: any) => {
    console.log("barcode scanned");
    const now = Date.now();
    if (now - lastScanTimeRef?.current < 500 || searching?.current || lastScanned?.current == data.data) return;
    lastScanTimeRef.current = now;
    searching.current = true;
    console.log(`Barcode scanned with data: ${JSON.stringify(data)}`);
    lastScanned.current = data.data;
    const existingItems = await db.getAllAsync("SELECT * FROM food_items WHERE ean_id = ?", [data.data])

    if (existingItems.length > 0) {
      console.log(JSON.stringify(existingItems[0]));
      searching.current = false;
      router.navigate({
        pathname: '/scan/[id]',
        params: { id: data.data }
      });
      return;
    } else {
      try {
        const url = `https://world.openfoodfacts.net/api/v2/product/${data.data}.json`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            UserAgent: "GramScaleApp/0.1 (johngorriceta1@gmail.com)",
            Authorization: 'Basic ' + btoa('off:off')
          }
        });
        const respData: FoodDataResponse = await response.json();
        const result = await db.runAsync("INSERT INTO food_items (ean_id,name,brand,image_url,calories,g_protein,g_carbs,g_fats,g_fiber,g_sodium) VALUES (?,?,?,?,?,?,?,?,?,?)", [
          data.data,
          respData.product.product_name,
          respData.product.brands,
          respData.product.image_small_url,
          respData.product.nutriments['energy-kcal'],
          respData.product.nutriments.proteins,
          respData.product.nutriments.carbohydrates,
          respData.product.nutriments.fat,
          respData.product.nutriments.fiber,
          respData.product.nutriments.sodium
        ])
        console.log("last inserted: " + result.lastInsertRowId);
        searching.current = false;
        router.navigate({
          pathname: '/scan/[id]',
          params: { id: data.data }
        });
      } catch (error) {
        Alert.alert(
          "Can't find food item!",
          "",
          [
            {
              text: "OK",
              onPress: () => {
                // Code to run after user presses OK
                searching.current = false;
                lastScanned.current = "";
                // continue with any other logic here
              }
            }
          ],
          { cancelable: false }
        );
        return;
      }
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused ? (
        <CameraView style={styles.camera} facing={facing} onBarcodeScanned={handleBarCodeScanned}>
        </CameraView>
      ) : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

