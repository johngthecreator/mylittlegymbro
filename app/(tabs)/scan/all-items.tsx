import { Colors } from "@/constants/Colors";
import { EvilIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function AllItems() {
  const db = useSQLiteContext();
  const [allItems, setAllItems] = useState<any[]>([]);
  const router = useRouter();
  const colorScheme = useColorScheme();

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
    <TouchableOpacity
      style={[
        styles.itemContainer,
        { borderBottomColor: Colors[colorScheme ?? "light"].tint },
      ]}
      onPress={() => router.push(`/scan/${item.id}`)}
    >
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text
          style={[
            styles.itemName,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.itemBrand,
            { color: Colors[colorScheme ?? "light"].icon },
          ]}
        >
          {item.brand}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={(e) => {
            e.stopPropagation();
            router.push(`/scan/edit/${item.id}`);
          }}
        >
          <EvilIcons
            name="pencil"
            size={24}
            color={Colors[colorScheme ?? "light"].tint}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
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
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemBrand: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 15,
  },
});
