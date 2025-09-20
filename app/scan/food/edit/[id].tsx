import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import { IFoodItem } from "@/core/interfaces";
import { IScannerController } from "@/core/scanner/scanner.interface";
import { ISummaryController } from "@/core/summary/summary.interface";
import { TYPES } from "@/core/types";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Container } from "inversify";
import { useCallback, useState } from "react";

import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

function EditScanDetails({ container }: { container: Container }) {
  const params = useLocalSearchParams<{ id: string }>();
  const [scanData, setScanData] = useState<IFoodItem | null>(null);
  const [name, setName] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fats, setFats] = useState<string>("");
  const [fiber, setFiber] = useState<string>("");
  const [servingQuantity, setServingQuantity] = useState<string>("");
  const [servingUnit, setServingUnit] = useState<string>("");
  const colorScheme = useColorScheme();

  const router = useRouter();

  const scannerController = container.get<IScannerController>(
    TYPES.IScannerController
  );
  const summaryController = container.get<ISummaryController>(
    TYPES.ISummaryController
  );

  const loadData = async () => {
    try {
      if (!params.id) return;
      const foodItem = await summaryController.getFoodItemById(
        Number(params.id)
      );
      if (foodItem) {
        setScanData(foodItem);
        setName(foodItem.name);
        setBrand(foodItem.brand || "");
        setCalories(String(foodItem.calories));
        setProtein(String(foodItem.g_protein));
        setCarbs(String(foodItem.g_carbs));
        setFats(String(foodItem.g_fats));
        setFiber(String(foodItem.g_fiber || ""));
        setServingQuantity(String(foodItem.serving_quantity || ""));
        setServingUnit(foodItem.serving_unit || "");
      }
    } catch (error) {
      console.error("Error loading data: ", error);
    }
  };

  const saveFoodItemDetails = async () => {
    try {
      if (!scanData || !params.id) return;

      const updatedFoodItem: IFoodItem = {
        ...scanData,
        name,
        brand,
        calories: Number(calories),
        g_protein: Number(protein),
        g_carbs: Number(carbs),
        g_fats: Number(fats),
        g_fiber: Number(fiber),
        serving_quantity: Number(servingQuantity),
        serving_unit: servingUnit,
      };

      await scannerController.updateFoodItem(
        updatedFoodItem,
        Number(params.id)
      );

      Alert.alert(
        "Saved!",
        "",
        [
          {
            text: "OK",
            onPress: async () => {
              router.back();
            },
          },
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
    <ScrollView
      contentContainerStyle={styles.container}
      automaticallyAdjustContentInsets={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.scanHeader}>
            <Image
              source={scanData.image_url}
              style={{
                height: 100,
                width: 100,
                borderRadius: 20,
                overflow: "hidden",
              }}
            />
            <View style={{ display: "flex", gap: 10, width: "70%" }}>
              <TextInput
                style={[
                  {
                    flexWrap: "wrap",
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 5,
                  },
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={[
                  { borderWidth: 1, borderRadius: 5, padding: 5 },
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                value={brand}
                onChangeText={setBrand}
              />
              <View
                style={{
                  width: "80%",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <TextInput
                  keyboardType={"numeric"}
                  style={[
                    {
                      borderWidth: 1,
                      width: 100,
                      borderRadius: 5,
                      padding: 5,
                    },
                    {
                      borderColor: Colors[colorScheme ?? "light"].tint,
                      color: Colors[colorScheme ?? "light"].text,
                    },
                  ]}
                  value={servingQuantity}
                  onFocus={() => setServingQuantity("")}
                  onChangeText={setServingQuantity}
                />
                <TextInput
                  style={[
                    {
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 5,
                      borderWidth: 1,
                    },
                    {
                      borderColor: Colors[colorScheme ?? "light"].tint,
                      color: Colors[colorScheme ?? "light"].text,
                    },
                  ]}
                  onFocus={() => setServingUnit("")}
                  value={servingUnit}
                  onChangeText={setServingUnit}
                />
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 10,
              color: Colors[colorScheme ?? "light"].text,
            }}
          >
            Nutritional info
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: Colors[colorScheme ?? "light"].background,
              padding: 15,
              gap: 10,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: Colors[colorScheme ?? "light"].tint,
              }}
            >
              <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
                Total calories
              </Text>
              <TextInput
                keyboardType={"numeric"}
                onFocus={() => setCalories("")}
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                value={calories}
                onChangeText={setCalories}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: Colors[colorScheme ?? "light"].tint,
              }}
            >
              <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
                Protein (g)
              </Text>
              <TextInput
                keyboardType={"numeric"}
                onFocus={() => setProtein("")}
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                value={protein}
                onChangeText={setProtein}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: Colors[colorScheme ?? "light"].tint,
              }}
            >
              <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
                Carbs (g)
              </Text>
              <TextInput
                keyboardType={"numeric"}
                onFocus={() => setCarbs("")}
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                value={carbs}
                onChangeText={setCarbs}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: Colors[colorScheme ?? "light"].tint,
              }}
            >
              <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
                Fats (g)
              </Text>
              <TextInput
                keyboardType={"numeric"}
                onFocus={() => setFats("")}
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                value={fats}
                onChangeText={setFats}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: Colors[colorScheme ?? "light"].tint,
              }}
            >
              <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
                Fiber (g)
              </Text>
              <TextInput
                keyboardType={"numeric"}
                onFocus={() => setFiber("")}
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                value={fiber}
                onChangeText={setFiber}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              width: "auto",
              backgroundColor: "lightblue",
              padding: 10,
              marginTop: 20,
              borderRadius: 100,
            }}
            onPress={saveFoodItemDetails}
          >
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

export default withContainer(EditScanDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 10,
    flex: 1,
  },
  scanHeader: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    paddingVertical: 20,
    padding: 15,
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: 100,
    textAlign: "right",
  },
  deleteButton: {
    marginTop: 15,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
  },
});
