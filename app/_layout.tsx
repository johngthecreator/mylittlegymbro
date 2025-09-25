import { useFonts } from "expo-font";

import { container } from "@/core/container";
import { TYPES } from "@/core/types";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

import { IMigrationController } from "@/core/migrations/migration.interface";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useQuickActionRouting } from "expo-quick-actions/router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const colorScheme = "dark";
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useQuickActionRouting();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const createIfNeeded = async (db: SQLiteDatabase) => {
    console.log("creating food_items table if needed");
    await db.runAsync(
      "CREATE TABLE IF NOT EXISTS food_items (id INTEGER PRIMARY KEY AUTOINCREMENT, ean_id TEXT, name TEXT NOT NULL, brand TEXT, image_url TEXT, g_amount REAL, calories INT NOT NULL, g_protein INT NOT NULL, g_carbs INT NOT NULL, g_fats INT NOT NULL, g_fiber INT, g_sodium REAL, is_quick_add BOOLEAN, serving_quantity REAL, serving_unit TEXT);"
    );

    console.log("creating log_entries table if needed");
    await db.runAsync(
      "CREATE TABLE IF NOT EXISTS log_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, food_item_id INTEGER NOT NULL, log_serving REAL NOT NULL, date TEXT NOT NULL, FOREIGN KEY (food_item_id) REFERENCES food_items(id));"
    );

    console.log("creating recipes table if needed");
    await db.runAsync(
      "CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, g_amount REAL NOT NULL, calories REAL NOT NULL, g_protein REAL NOT NULL, g_carbs REAL NOT NULL, g_fats REAL NOT NULL);"
    );

    // Check if already bound to prevent duplicate bindings
    if (!container.isBound(TYPES.SQLiteDatabase)) {
      container.bind(TYPES.SQLiteDatabase).toConstantValue(db);
      console.log("Database bound to Inversify container");
    } else {
      console.log("Database already bound to Inversify container");
    }

    // Run migrations after initial table creation and DB binding
    const migrationController = container.get<IMigrationController>(
      TYPES.IMigrationController
    );
    await migrationController.runMigrations();
  };

  return (
    <SQLiteProvider databaseName="scale.db" onInit={createIfNeeded}>
      <ThemeProvider value={DarkTheme}>
        <NativeTabs>
          <NativeTabs.Trigger name="summary">
            <Label>Summary</Label>
            <Icon sf="book.pages.fill" drawable="custom_android_drawable" />
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="scan">
            <Icon sf="barcode.viewfinder" drawable="custom_android_drawable" />
            <Label>Scanner</Label>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="profiles">
            <Icon sf="person" drawable="custom_android_drawable" />
            <Label>Profiles</Label>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="(search)" role="search">
            <Icon sf="magnifyingglass" drawable="ic_search" />
            <Label>Search</Label>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="chat">
            <Icon
              sf="bubble.left.and.bubble.right.fill"
              drawable="custom_android_drawable"
            />
            <Label>Chat</Label>
          </NativeTabs.Trigger>
        </NativeTabs>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
