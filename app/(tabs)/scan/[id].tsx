import { Colors } from "@/constants/Colors";
import { EvilIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

export default function ScanDetails() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{ id: string }>();
  const [scanData, setScanData] = useState<any>();
  const [isUnit, setIsUnit] = useState<boolean>(false);
  const [servingAmount, setServingAmount] = useState<number>(1);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const loadData = async () => {
    try {
      const data = await db.getAllAsync(
        "SELECT * FROM food_items WHERE id = ?",
        [params.id]
      );
      setScanData(data[0]);
    } catch (error) {
      console.error("Error loading data: ", error);
    }
  };

  const handleServingInput = (input: string) => {
    const numberServingAmount = Number(input);
    setServingAmount(numberServingAmount);
  };

  const logScannedFoodItem = async () => {
    await db.runAsync(
      "INSERT INTO log_entries (food_item_id, date, log_serving) VALUES (?,?,?)",
      [
        scanData.id,
        new Date().toISOString(),
        isUnit ? servingAmount / scanData.serving_quantity : servingAmount,
      ]
    );
    Alert.alert(
      "Food Logged!",
      "",
      [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ],
      { cancelable: false }
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (!scanData) {
    return <View />;
  }

  const dismissInput = () => {
    Keyboard.dismiss(); // Hides the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={dismissInput}>
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
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
            <Text
              style={{
                flexWrap: "wrap",
                color: Colors[colorScheme ?? "light"].text,
              }}
            >
              {scanData.name}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              {scanData.brand}
            </Text>
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
                style={{
                  borderWidth: 1,
                  width: 100,
                  borderColor: Colors[colorScheme ?? "light"].tint,
                  borderRadius: 5,
                  padding: 5,
                  color: Colors[colorScheme ?? "light"].text,
                }}
                value={String(servingAmount)}
                onChangeText={(input) => handleServingInput(input)}
              />
              <TouchableOpacity
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  backgroundColor: Colors[colorScheme ?? "light"].tint,
                }}
                onPress={() => setIsUnit(!isUnit)}
              >
                <Text
                  style={{ color: Colors[colorScheme ?? "light"].background }}
                >
                  {isUnit
                    ? `(${scanData.serving_unit}) amount`
                    : "# of servings"}
                </Text>
              </TouchableOpacity>
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
            backgroundColor: Colors[colorScheme ?? "light"].card,
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
              borderBottomWidth: 1,
              paddingBottom: 10,
              borderColor: Colors[colorScheme ?? "light"].tint,
            }}
          >
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              Total calories
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              {Math.round(
                (scanData.calories || 0) *
                  (isUnit
                    ? servingAmount / scanData.serving_quantity
                    : servingAmount) *
                  100
              ) / 100}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              paddingBottom: 10,
              borderColor: Colors[colorScheme ?? "light"].tint,
            }}
          >
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              Protein (g)
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              {Math.round(
                (scanData.g_protein || 0) *
                  (isUnit
                    ? servingAmount / scanData.serving_quantity
                    : servingAmount) *
                  100
              ) / 100}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              paddingBottom: 10,
              borderColor: Colors[colorScheme ?? "light"].tint,
            }}
          >
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              Carbs (g)
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              {Math.round(
                (scanData.g_carbs || 0) *
                  (isUnit
                    ? servingAmount / scanData.serving_quantity
                    : servingAmount) *
                  100
              ) / 100}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              paddingBottom: 10,
              borderColor: Colors[colorScheme ?? "light"].tint,
            }}
          >
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              Fats (g)
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              {Math.round(
                (scanData.g_fats || 0) *
                  (isUnit
                    ? servingAmount / scanData.serving_quantity
                    : servingAmount) *
                  100
              ) / 100}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              paddingBottom: 10,
              borderColor: Colors[colorScheme ?? "light"].tint,
            }}
          >
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              Fiber (g)
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              {Math.round(
                (scanData.g_fiber || 0) *
                  (isUnit
                    ? servingAmount / scanData.serving_quantity
                    : servingAmount) *
                  100
              ) / 100}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              Sodium (g)
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              {Math.round(
                (scanData.g_sodium || 0) *
                  (isUnit
                    ? servingAmount / scanData.serving_quantity
                    : servingAmount) *
                  100
              ) / 100}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              flex: 1,
              backgroundColor: Colors[colorScheme ?? "light"].tint,
              padding: 10,
              borderRadius: 100,
            }}
            onPress={logScannedFoodItem}
          >
            <EvilIcons
              name="plus"
              size={20}
              color={Colors[colorScheme ?? "light"].background}
            />
            <Text style={{ color: Colors[colorScheme ?? "light"].background }}>
              Log food
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              flex: 1,
              backgroundColor: Colors[colorScheme ?? "light"].card,
              padding: 10,
              borderRadius: 100,
            }}
            onPress={() => router.push(`/scan/edit/${params.id}`)}
          >
            <EvilIcons
              name="pencil"
              size={20}
              color={Colors[colorScheme ?? "light"].text}
            />
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 10,
  },
  scanHeader: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    paddingVertical: 20,
  },
  caloriesWrapper: {
    padding: 30,
    height: 100,
    borderRadius: 100,
    justifyContent: "center",
    gap: 5,
    display: "flex",
    flexDirection: "column",
  },
  macrosWrapper: {
    height: 100,
    width: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});
