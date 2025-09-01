import withContainer from "@/components/withContainer";
import { IInsertController } from "@/core/insert/insert.interface";
import { TYPES } from "@/core/types";
import { Container } from "inversify";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

const QuickAdd = ({ container }: { container: Container }) => {
  // New state management for the input fields
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [log_serving, setLogServing] = useState("");
  // added the controller
  const insertController = container.get<IInsertController>(
    TYPES.IInsertController
  );
  const handleAddFoodItem = () => {
    console.log("Adding food item: ", name, calories, protein, carbs, fat);
    const foodItem = {
      name,
      calories: Number(calories),
      g_protein: Number(protein),
      g_carbs: Number(carbs),
      g_fats: Number(fat),
      is_quick_add: true,
    };

    insertController.quickAddFoodItem(
      foodItem,
      Number(log_serving),
      new Date().toISOString()
    );
  };

  // Updated return statement to include TextInput components
  return (
    <View>
      <Text>Quick Add</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Protein"
        value={protein}
        onChangeText={setProtein}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Carbs"
        value={carbs}
        onChangeText={setCarbs}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Fat"
        value={fat}
        onChangeText={setFat}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Log Serving"
        value={log_serving}
        onChangeText={setLogServing}
        keyboardType="numeric"
      />
      <Button title="Add" onPress={handleAddFoodItem} />
    </View>
  );
};

export default withContainer(QuickAdd);
