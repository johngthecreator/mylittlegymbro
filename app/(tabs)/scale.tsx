import {
  StyleSheet,
  View,
  Button,
  FlatList,
  Text,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "expo-image";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";

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
export default function ScaleScreen() {
  const [logEntries, setLogEntries] = useState<any[]>([]);

  const db = useSQLiteContext();
  const { height } = Dimensions.get("window");
  const date = new Date();
  const midnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)).toISOString();
  const router = useRouter();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const days = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];

  const handleDelete = async (entry_id: string) => {
    setLogEntries(logEntries.filter(entry => entry.entry_id !== entry_id))
    await db.runAsync("DELETE FROM log_entries WHERE id = ?", [
      entry_id
    ])
  }

  const loadData = async () => {
    try {
      const result = await db.getAllAsync("SELECT * FROM log_entries WHERE date  > ? ORDER BY date DESC", [midnight]);
      console.log("Query result:", result);
      const entries: any = [];
      result.forEach((result: any) => {
        const foodData = db.getAllSync("SELECT * FROM food_items WHERE id = ?", [result.food_item_id])
        entries.push({ ...foodData[0] as Object, date: result.date, entry_id: result.id });
      })
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
        <Text style={{ fontSize: 20, fontWeight: 'light', marginBottom: 20 }}>{`${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'semibold', marginBottom: 20 }}>Daily summary</Text>
        <View style={{ height: height, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <View style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <View style={styles.caloriesWrapper}>
              <Text style={{ fontSize: 40, fontWeight: 'semibold' }}>{logEntries.reduce((acc, entry) => acc + entry.calories, 0)}</Text>
              <Text style={{ fontSize: 18 }}>Calories consumed</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <View style={styles.macrosWrapper}>
                  <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{logEntries.reduce((acc, entry) => acc + entry.g_protein, 0)}</Text>
                </View>
                <Text>Protein</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <View style={styles.macrosWrapper}>
                  <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{logEntries.reduce((acc, entry) => acc + entry.g_carbs, 0)}</Text> Carbs (g)
                </View>
                <Text>Carbs</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <View style={styles.macrosWrapper}>
                  <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>{logEntries.reduce((acc, entry) => acc + entry.g_fats, 0)}</Text> Fats (g)
                </View>
                <Text>Fats</Text>
              </View>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: 'semibold', marginTop: 20 }}>Food log</Text>
            {/* <Link href="/nutrition/1">Quick Add</Link> */}
          </View>
          {logEntries.length > 0 ?
            <FlatList data={logEntries} renderItem={(log_entry: any) => {
              const entry = log_entry.item;
              return (
                <Pressable onPress={() =>
                  router.navigate({
                    pathname: '/nutrition/[id]',
                    params: { id: entry.id }
                  })} >
                  <ImageBackground
                    blurRadius={20}
                    source={{ uri: entry.image_url }}
                    style={{
                      overflow: 'hidden',
                      marginRight: 10,
                      borderRadius: 40,
                    }}
                  >
                    <View key={entry.id} style={styles.logCard}>
                      <View>
                        <Text style={{ color: 'white' }}>
                          {entry.name}
                        </Text>
                        <Text style={{ color: 'white' }}>
                          {entry.calories} calories
                        </Text>
                        <Text style={{ color: 'white' }}>
                          {entry.g_protein}g protein
                        </Text>
                      </View>
                      <TouchableOpacity style={{ alignSelf: 'flex-end', backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 5, borderRadius: 100 }} onPress={() => handleDelete(entry.entry_id)}>
                        <EvilIcons size={30} name="trash" />
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                </Pressable>
              )
            }
            }
              keyExtractor={item => `${item?.id?.toString()}-${item?.entry_id.toString()}`}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
            : (
              <Text>
                No Food Logged!
              </Text>
            )}
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  mainContainer: {
    backgroundColor: 'white',
    height: '100%',
    padding: 10
  },
  caloriesWrapper: {
    padding: 30,
    height: 150,
    borderRadius: 40,
    backgroundColor: 'lavender',
    justifyContent: 'center',
    gap: 5,
    display: 'flex',
    flexDirection: 'column'
  },
  macrosWrapper: {
    height: 100,
    width: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: 'lavender'
  },
  logCard: {
    height: 400,
    width: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 25
  }
});
