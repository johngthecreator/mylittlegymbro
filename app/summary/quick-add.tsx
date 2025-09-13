import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import { ICreateFoodItem } from "@/core/interfaces";
import { IScannerController } from "@/core/scanner/scanner.interface";
import { TYPES } from "@/core/types";
import { useRouter } from "expo-router";
import { Container } from "inversify";
import { useState } from "react";
import {
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

function QuickAdd({ container }: { container: Container }) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [servingQuantity, setServingQuantity] = useState("");
  const [servingUnit, setServingUnit] = useState("g"); // Default to 'g'
  const [servingsConsumed, setServingsConsumed] = useState("1"); // Default to 1 serving
  const colorScheme = useColorScheme();

  const scannerController = container.get<IScannerController>(
    TYPES.IScannerController
  );
  const router = useRouter();

  const handleAddFoodItem = async () => {
    const foodItem: ICreateFoodItem = {
      name,
      calories: Number(calories),
      g_protein: Number(protein),
      g_carbs: Number(carbs),
      g_fats: Number(fat),
      serving_quantity: Number(servingQuantity),
      serving_unit: servingUnit,
      is_quick_add: true,
    };

    await scannerController.quickAddFoodItem(
      foodItem,
      Number(servingsConsumed),
      new Date().toISOString()
    );
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  const toggleServingUnit = () => {
    setServingUnit((prevUnit) => (prevUnit === "g" ? "ml" : "g"));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      automaticallyAdjustKeyboardInsets={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            Food Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors[colorScheme ?? "light"].tint,
                color: Colors[colorScheme ?? "light"].text,
                backgroundColor: "#3A3A3A",
              },
            ]}
            placeholder="Scrambled Eggs"
            placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
            value={name}
            onChangeText={setName}
          />

          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            Portion Size
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                styles.inputHalf,
                {
                  borderColor: Colors[colorScheme ?? "light"].tint,
                  color: Colors[colorScheme ?? "light"].text,
                  backgroundColor: "#3A3A3A",
                },
              ]}
              placeholder="100"
              placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
              value={servingQuantity}
              onChangeText={setServingQuantity}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={toggleServingUnit}
              style={[
                styles.inputUnitButton,
                { backgroundColor: Colors[colorScheme ?? "light"].tint },
              ]}
            >
              <Text
                style={[
                  styles.inputUnitText,
                  { color: Colors[colorScheme ?? "light"].background },
                ]}
              >
                {servingUnit}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text
                style={[
                  styles.label,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                Carbs
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                    backgroundColor: "#3A3A3A",
                  },
                ]}
                placeholder="1.3"
                placeholderTextColor={
                  Colors[colorScheme ?? "light"].text + "80"
                }
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.column}>
              <Text
                style={[
                  styles.label,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                Protein
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                    backgroundColor: "#3A3A3A",
                  },
                ]}
                placeholder="13"
                placeholderTextColor={
                  Colors[colorScheme ?? "light"].text + "80"
                }
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text
                style={[
                  styles.label,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                Fat
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                    backgroundColor: "#3A3A3A",
                  },
                ]}
                placeholder="10"
                placeholderTextColor={
                  Colors[colorScheme ?? "light"].text + "80"
                }
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.column}>
              <Text
                style={[
                  styles.label,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                Calories
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: Colors[colorScheme ?? "light"].tint,
                    color: Colors[colorScheme ?? "light"].text,
                    backgroundColor: "#3A3A3A",
                  },
                ]}
                placeholder="155"
                placeholderTextColor={
                  Colors[colorScheme ?? "light"].text + "80"
                }
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            How many servings did you have?
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors[colorScheme ?? "light"].tint,
                color: Colors[colorScheme ?? "light"].text,
                backgroundColor: "#3A3A3A",
              },
            ]}
            placeholder="1"
            placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
            value={servingsConsumed}
            onChangeText={setServingsConsumed}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
            ]}
            onPress={handleAddFoodItem}
          >
            <Text
              style={[
                styles.saveButtonText,
                { color: Colors[colorScheme ?? "light"].background },
              ]}
            >
              Add Food
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  innerContainer: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputHalf: {
    flex: 1,
    marginRight: 10,
  },
  inputUnitButton: {
    marginTop: -11,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 15,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  inputUnitText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  column: {
    flex: 1,
  },
  saveButton: {
    padding: 15,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 15,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default withContainer(QuickAdd);
