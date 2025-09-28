import { Colors } from "@/constants/Colors";
import { container } from "@/core/container";
import { IFoodItem } from "@/core/interfaces";
import { ILlamaController } from "@/core/llama/llama.interface";
import { IScannerController } from "@/core/scanner/scanner.interface";
import { ISummaryController } from "@/core/summary/summary.interface";
import { TYPES } from "@/core/types";
import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { extractTextFromImage } from "expo-text-extractor";
import { useCallback, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const [currData, setCurrData] = useState<any>();
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);

  const llamaController = container.get<ILlamaController>(
    TYPES.ILlamaController
  );

  const summaryController = container.get<ISummaryController>(
    TYPES.ISummaryController
  );

  const scannerController = container.get<IScannerController>(
    TYPES.IScannerController
  );

  const systemPrompt = `

    You function as a **High-Precision OCR Data Extraction Agent**. Your sole responsibility is to process raw text from **Nutritional Information** (simulating an OCR scan) and extract the quantities for the **Serving Size** and the three key dietary macros (Protein, Total Fat, and Total Carbohydrate).

    ***

    **Crucial Clarification:** You **MUST** extract the **Serving Size** (the amount and **metric** unit for a single serving, **prioritizing mass (g/mg) or volume (mL) over arbitrary measures** like '1/2 cup'. For example, extract '55 g' instead of '1/2 cup'). You **MUST NOT** extract the 'Servings Per Container' or 'Servings Per Package' value.

    ***

    **Required Extraction Fields:**
    1. **Serving Size** (**Metric** Amount and **Metric** Unit, e.g., '55 g')
    2. **Protein** (Amount and Unit)
    3. **Total Fat** (Amount and Unit)
    4. **Total Carbohydrate** (Amount and Unit)

    ***

    **Strict Output Constraint:** Your response **MUST** be a single JSON object. **ABSOLUTELY NO** introductory text, explanations, or data outside of the JSON structure. All keys in the JSON **MUST** use **lowercase with underscores (snake\_case)**. If any specific field (amount or unit) cannot be found, output **"N/A"** for its value.

    **Input Structure:** Nutritional Information: {{topic}}

    **Desired Output Format (Using Nested Objects):**

    {
      "serving_size": {
        "amount": [Value, e.g., 55],
        "unit": [Value, e.g., "g" or "mL"]
      },
      "protein": {
        "amount": [Value, e.g., 15],
        "unit": [Value, e.g., "g" or "mg"]
      },
      "total_fat": {
        "amount": [Value, e.g., 3.5],
        "unit": [Value, e.g., "g" or "mg"]
      },
      "total_carbohydrate": {
        "amount": [Value, e.g., 25],
        "unit": [Value, e.g., "g" or "mg"]
      }
    }

  `;

  const loadData = async () => {
    try {
      if (!params.id) return;
      const foodItem = await summaryController.getFoodItemById(
        Number(params.id)
      );
      if (foodItem) {
        setCurrData(foodItem);
      }
    } catch (error) {
      console.error("Error loading data: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Photo taken:", photo.uri);
      const extractedTexts = await extractTextFromImage(photo.uri);
      const result = await llamaController.dataExtraction(
        systemPrompt,
        extractedTexts.join(" ")
      );

      const data = JSON.parse(result);

      const requiredKeys = [
        "serving_size",
        "protein",
        "total_fat",
        "total_carbohydrate",
      ];

      let allKeysPresent = true;
      for (const key of requiredKeys) {
        if (!data[key] || !data[key].amount || !data[key].unit) {
          allKeysPresent = false;
          break;
        }
      }

      console.log(data);

      if (allKeysPresent) {
        const updatedFoodItem: IFoodItem = {
          ...currData,
          g_carbs: data.total_carbohydrate.amount,
          g_fats: data.total_fat.amount,
          g_protein: data.protein.amount,
          serving_quantity: data.serving_size.amount,
          serving_unit: data.serving_size.unit,
        };

        await scannerController.updateFoodItem(
          updatedFoodItem,
          Number(params.id)
        );
        console.log("edited");
        router.back();
      } else {
        throw new Error("incorrect json response");
      }
    }
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
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <TouchableOpacity
            style={{
              height: 100,
              width: 100,
              backgroundColor: "white",
              borderRadius: 150,
              margin: 35,
            }}
            onPress={takePicture}
          />

          <TouchableOpacity
            style={{
              position: "absolute",
              height: 50,
              width: 50,
              backgroundColor: "red",
              borderRadius: 150,
              margin: 35,
              marginRight: 250,
              marginBottom: 60,
            }}
            onPress={() => router.back()}
          />
        </CameraView>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
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
