import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { EvilIcons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import withContainer from "@/components/withContainer";
import { Container } from "inversify";

/**
 * Screen component that displays a daily nutrition summary and a horizontal food log.
 *
 * Loads log entries from a local SQLite database (all entries with date < UTC midnight of today), enriches each log with its food item data, and maintains them in component state. Shows totals for calories, protein, carbs, and fats; renders logged foods as tappable cards that navigate to a nutrition detail screen; and allows removing a log entry which updates local state and deletes the row from the database.
 *
 * Side effects:
 * - Reads from the SQLite database on screen focus.
 * - Deletes rows from the `log_entries` table when a user taps Delete.
 * - Navigates to `/nutrition/[id]` when a food card is pressed.
 *
 * @returns A React element for the nutrition summary screen.
 */
function HomeScreen({ container }: { container: Container }) {
  const [logEntries, setLogEntries] = useState<any[]>([]);
  const [quickAddFoodItems, setQuickAddFoodItems] = useState<any[]>([]);

  const db = useSQLiteContext();
  const { height } = Dimensions.get("window");
  const date = new Date();
  const midnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  ).toISOString();
  console.log(midnight);
  const router = useRouter();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDelete = async (entry_id: string) => {
    setLogEntries(logEntries.filter((entry) => entry.entry_id !== entry_id));
    await db.runAsync("DELETE FROM log_entries WHERE id = ?", [entry_id]);
  };

  const loadData = async () => {
    try {
      const quickAdd = await db.getAllAsync(
        "SELECT * FROM food_items WHERE is_quick_add = 1"
      );
      const result = await db.getAllAsync(
        "SELECT * FROM log_entries WHERE date > ? ORDER BY date DESC",
        [midnight]
      );
      console.log("Query result:", result);
      const entries: any = [];
      result.forEach((result: any) => {
        const foodData = db.getAllSync(
          "SELECT * FROM food_items WHERE id = ?",
          [result.food_item_id]
        );
        entries.push({
          ...(foodData[0] as Object),
          date: result.date,
          entry_id: result.id,
          log_serving: result.log_serving,
        });
      });
      console.log(quickAdd);
      setLogEntries(entries);
      console.log(entries);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Link href="/quick-add">Quick Add</Link>
        <Text
          style={{ fontSize: 20, fontWeight: "light", marginBottom: 20 }}
        >{`${days[date.getDay()]}, ${
          months[date.getMonth()]
        } ${date.getDate()}`}</Text>
        <Text
          style={{ fontSize: 20, fontWeight: "semibold", marginBottom: 20 }}
        >
          Daily summary
        </Text>
        <View
          style={{
            height: height,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <View style={styles.caloriesWrapper}>
              <Text style={{ fontSize: 40, fontWeight: "semibold" }}>
                {Math.round(
                  logEntries.reduce(
                    (acc, entry) => acc + entry.calories * entry.log_serving,
                    0
                  ) * 10
                ) / 10}
              </Text>
              <Text style={{ fontSize: 18 }}>Calories consumed</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <View style={styles.macrosWrapper}>
                  <Text style={{ fontSize: 30, fontWeight: "semibold" }}>
                    {Math.round(
                      logEntries.reduce(
                        (acc, entry) =>
                          acc + entry.g_protein * entry.log_serving,
                        0
                      ) * 10
                    ) / 10}
                  </Text>
                </View>
                <Text>Protein (g)</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <View style={styles.macrosWrapper}>
                  <Text style={{ fontSize: 30, fontWeight: "semibold" }}>
                    {Math.round(
                      logEntries.reduce(
                        (acc, entry) => acc + entry.g_carbs * entry.log_serving,
                        0
                      ) * 10
                    ) / 10}
                  </Text>
                </View>
                <Text>Carbs (g)</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <View style={styles.macrosWrapper}>
                  <Text style={{ fontSize: 30, fontWeight: "semibold" }}>
                    {Math.round(
                      logEntries.reduce(
                        (acc, entry) => acc + entry.g_fats * entry.log_serving,
                        0
                      ) * 10
                    ) / 10}
                  </Text>
                </View>
                <Text>Fats (g)</Text>
              </View>
            </View>
          </View>
          {logEntries.length > 0 ? (
            <FlatList
              data={logEntries}
              renderItem={(log_entry: any) => {
                const entry = log_entry.item;
                return (
                  <Pressable
                    onPress={() =>
                      router.navigate({
                        pathname: "/nutrition/[id]",
                        params: { id: entry.id },
                      })
                    }
                  >
                    <ImageBackground
                      blurRadius={20}
                      source={{ uri: entry.image_url }}
                      style={{
                        overflow: "hidden",
                        marginRight: 10,
                        borderRadius: 40,
                      }}
                    >
                      <View key={entry.id} style={styles.logCard}>
                        <View>
                          <Text style={{ color: "white" }}>{entry.name}</Text>
                          <Text style={{ color: "white" }}>
                            {Math.round(
                              entry.calories * entry.log_serving * 10
                            ) / 10}{" "}
                            calories
                          </Text>
                          <Text style={{ color: "white" }}>
                            {Math.round(
                              entry.g_protein * entry.log_serving * 10
                            ) / 10}
                            g protein
                          </Text>
                          <Text style={{ color: "white" }}>
                            {Math.round(entry.log_serving * 10) / 10} servings
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            alignSelf: "flex-end",
                            backgroundColor: "white",
                            paddingVertical: 8,
                            paddingHorizontal: 5,
                            borderRadius: 100,
                          }}
                          onPress={() => handleDelete(entry.entry_id)}
                        >
                          <EvilIcons size={30} name="trash" />
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </Pressable>
                );
              }}
              keyExtractor={(item) =>
                `${item?.id?.toString()}-${item?.entry_id.toString()}`
              }
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text>No Food Logged!</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default withContainer(HomeScreen);

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  mainContainer: {
    backgroundColor: "white",
    height: "100%",
    padding: 10,
  },
  caloriesWrapper: {
    padding: 30,
    height: 150,
    borderRadius: 40,
    backgroundColor: "lavender",
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
    backgroundColor: "lavender",
  },
  logCard: {
    height: 400,
    width: 300,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 25,
  },
});
