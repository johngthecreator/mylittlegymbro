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

import { GlassView } from "expo-glass-effect";

import { EvilIcons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

import withContainer from "@/components/withContainer";
import { IProfileController } from "@/core/profiles/profile.interface";
import { ISummaryController } from "@/core/summary/summary.interface";
import { TYPES } from "@/core/types";
import { useHeaderHeight } from "@react-navigation/elements";
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
  const [background, setBackground] = useState<string>("");
  const headerHeight = useHeaderHeight();

  const summaryController = container.get<ISummaryController>(
    TYPES.ISummaryController
  );
  const profileController = container.get<IProfileController>(
    TYPES.IProfileController
  );
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

  const handleDelete = async (entry_id: number) => {
    await summaryController.deleteLogEntry(entry_id);
    setLogEntries((prev) => prev.filter((entry) => entry.id != entry_id));
  };

  const loadData = async () => {
    try {
      const activeProfile = await profileController.getActiveProfile();
      const parsedProfileId = activeProfile?.id || 1; // Default to 1 if no active profile set

      if (activeProfile?.background) {
        setBackground(activeProfile.background);
      }

      const loggedFoodItems = await summaryController.getLoggedFoodItems(
        midnight,
        parsedProfileId
      );
      setLogEntries(loggedFoodItems);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderLogItem = useCallback(({ item: entry }: { item: any }) => {
    return (
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: "/scan/food/[id]",
            params: {
              id: entry.food_item_id,
            },
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
                {Math.round(entry.calories * entry.log_serving)} calories
              </Text>
              <Text style={{ color: "white" }}>
                {Math.round(entry.g_protein * entry.log_serving)}g protein
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
              onPress={() => handleDelete(entry.id)}
            >
              <EvilIcons size={30} name="trash" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Pressable>
    );
  }, []);

  return (
    <ImageBackground
      source={
        background != "blank"
          ? { uri: background }
          : require("../../assets/images/default_background.jpeg")
      }
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={{ paddingTop: headerHeight }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "light",
            marginBottom: 25,
            color: "white",
          }}
        >{`${days[date.getDay()]}, ${
          months[date.getMonth()]
        } ${date.getDate()}`}</Text>
        <View
          style={{
            height: height,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <GlassView
              glassEffectStyle="regular"
              style={styles.caloriesWrapper}
            >
              <Text
                style={{ fontSize: 40, fontWeight: "semibold", color: "white" }}
              >
                {Math.round(
                  logEntries.reduce(
                    (acc, entry) => acc + entry.calories * entry.log_serving,
                    0
                  )
                )}
              </Text>
              <Text style={{ fontSize: 18, color: "white" }}>
                Calories consumed
              </Text>
            </GlassView>
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
                <GlassView
                  glassEffectStyle="regular"
                  style={styles.macrosWrapper}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "semibold",
                      color: "white",
                    }}
                  >
                    {Math.round(
                      logEntries.reduce(
                        (acc, entry) =>
                          acc + entry.g_protein * entry.log_serving,
                        0
                      )
                    )}
                  </Text>
                </GlassView>
                <Text style={{ color: "white" }}>Protein (g)</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <GlassView
                  glassEffectStyle="regular"
                  style={styles.macrosWrapper}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "semibold",
                      color: "white",
                    }}
                  >
                    {Math.round(
                      logEntries.reduce(
                        (acc, entry) => acc + entry.g_carbs * entry.log_serving,
                        0
                      )
                    )}
                  </Text>
                </GlassView>
                <Text style={{ color: "white" }}>Carbs (g)</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <GlassView
                  glassEffectStyle="regular"
                  style={styles.macrosWrapper}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "semibold",
                      color: "white",
                    }}
                  >
                    {Math.round(
                      logEntries.reduce(
                        (acc, entry) => acc + entry.g_fats * entry.log_serving,
                        0
                      )
                    )}
                  </Text>
                </GlassView>
                <Text style={{ color: "white" }}>Fats (g)</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "semibold",
                color: "white",
              }}
            >
              Food Log
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Link
                href="/summary/quick-add"
                style={{
                  color: "white",
                  fontSize: 16,
                  paddingHorizontal: 7,
                  paddingVertical: 10,
                  borderRadius: 100,
                  backgroundColor: "gray",
                }}
              >
                <EvilIcons name="plus" size={25} />
              </Link>
            </View>
          </View>
          {logEntries.length > 0 ? (
            <FlatList
              data={logEntries}
              renderItem={renderLogItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={{ color: "white" }}>No Food Logged!</Text>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default withContainer(HomeScreen);

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "transparent",
    height: "110%",
    padding: 15,
    paddingTop: 10,
    paddingBottom: 30,
  },
  caloriesWrapper: {
    padding: 30,
    height: 150,
    borderRadius: 40,
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
