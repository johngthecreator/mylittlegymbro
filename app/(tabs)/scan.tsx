import { Colors } from "@/constants/Colors";
import { container } from "@/core/container";
import { IScannerController } from "@/core/scanner/scanner.interface";
import { ISummaryController } from "@/core/summary/summary.interface";
import { TYPES } from "@/core/types";
import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

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
  serving_quantity: number;
  serving_quantity_unit: string;
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
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const lastScanTimeRef = useRef(0);
  const searching = useRef(false);
  const lastScanned = useRef("");
  const router = useRouter();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      lastScanned.current = "";
    }, [])
  );

  const handleBarCodeScanned = async (data: any) => {
    console.log("barcode scanned");
    const scannerController = container.get<IScannerController>(
      TYPES.IScannerController
    );
    const summaryController = container.get<ISummaryController>(
      TYPES.ISummaryController
    );
    const now = Date.now();
    if (
      now - lastScanTimeRef?.current < 500 ||
      searching?.current ||
      lastScanned?.current == data.data
    )
      return;
    lastScanTimeRef.current = now;
    searching.current = true;
    console.log(`Barcode scanned with data: ${JSON.stringify(data)}`);
    let ean_id = data.data;
    if (Array.from(ean_id).length < 13) {
      ean_id = "0" + ean_id;
    }
    lastScanned.current = ean_id;

    try {
      const id = await summaryController.processScannedEan(ean_id);
      router.navigate({ pathname: "/food/[id]", params: { id: id } });
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Can't find food item!",
        "",
        [
          {
            text: "OK",
            onPress: () => {
              searching.current = false;
              lastScanned.current = "";
            },
          },
        ],
        { cancelable: false }
      );
    }
    searching.current = false;
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        ></CameraView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
