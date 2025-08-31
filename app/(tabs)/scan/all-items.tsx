import { useFocusEffect, useRouter } from "expo-router";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { EvilIcons } from "@expo/vector-icons";

export default function AllItems() {
  const db = useSQLiteContext();
  const [allItems, setAllItems] = useState<any[]>([]);
  const router = useRouter();

  const loadData = async () => {
    try {
      const data = await db.getAllAsync("SELECT * FROM food_items");
      setAllItems(data);
    } catch (error) {
      console.error("Error loading data: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.itemBrand}>{item.brand}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push(`/scan/edit/${item.ean_id}`)}>
          <EvilIcons name="pencil" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push(`/scan/${item.ean_id}`)}>
          <EvilIcons name="plus" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemBrand: {
    fontSize: 14,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 15,
  },
});