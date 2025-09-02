import withContainer from "@/components/withContainer";
import { IInsertController } from "@/core/insert/insert.interface";
import { TYPES } from "@/core/types";
import { useRouter } from "expo-router";
import { Container } from "inversify";
import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const QuickAdd = ({ container }: { container: Container }) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [servingQuantity, setServingQuantity] = useState("");
  const [servingUnit, setServingUnit] = useState("g"); // Default to 'g'
  const [servingsConsumed, setServingsConsumed] = useState("1"); // Default to 1 serving
  const [currentStep, setCurrentStep] = useState(1); // 1 for food details, 2 for servings
  const [foodItemId, setFoodItemId] = useState<number | null>(null);

  const insertController = container.get<IInsertController>(
    TYPES.IInsertController
  );
  const router = useRouter();

  const handleAddFoodItem = async () => {
    const foodItem = {
      name,
      calories: Number(calories),
      g_protein: Number(protein),
      g_carbs: Number(carbs),
      g_fats: Number(fat),
      serving_quantity: Number(servingQuantity),
      serving_unit: servingUnit,
      is_quick_add: true,
    };

    await insertController.quickAddFoodItem(
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Removed header with close button and title */}

        <View style={styles.innerContainer}>
          <Text style={styles.label}>Food Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Scrambled Eggs"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Portion Size</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="100"
              placeholderTextColor="#888"
              value={servingQuantity}
              onChangeText={setServingQuantity}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={toggleServingUnit}
              style={styles.inputUnitButton}
            >
              <Text style={styles.inputUnitText}>{servingUnit}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Carbs</Text>
              <TextInput
                style={styles.input}
                placeholder="1.3"
                placeholderTextColor="#888"
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Protein</Text>
              <TextInput
                style={styles.input}
                placeholder="13"
                placeholderTextColor="#888"
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Fat</Text>
              <TextInput
                style={styles.input}
                placeholder="10"
                placeholderTextColor="#888"
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="155"
                placeholderTextColor="#888"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>How many servings did you have?</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            placeholderTextColor="#888"
            value={servingsConsumed}
            onChangeText={setServingsConsumed}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddFoodItem}
          >
            <Text style={styles.saveButtonText}>Add Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleClose}>
            <Text style={styles.deleteButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A", // Dark background
    padding: 20,
    paddingTop: 50,
  },
  innerContainer: {
    // Renamed from contentContainer and removed card-like styles
    flex: 1,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#3A3A3A", // Even lighter dark for inputs
    color: "white",
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
    backgroundColor: "#3A3A3A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  inputUnitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50", // Vibrant green for save/next
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 15,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#E57373", // Red for delete/cancel
    fontSize: 16,
  },
});

export default withContainer(QuickAdd);
