import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

/**
 * Root-level layout for the app — initializes runtime dependencies and renders the app shell.
 *
 * Sets up the SQLite database (creates required tables if they do not exist), loads the SpaceMono font
 * before rendering, applies theming based on the current color scheme, and defines the primary navigation stack.
 *
 * Database initialization (performed via the provider's `onInit` callback) ensures these tables exist:
 * - food_items (columns include id, ean_id, name, brand, image_url, g_amount, calories, g_protein, g_carbs, g_fats, g_fiber, g_sodium, is_quick_add)
 * - log_entries (columns include id, food_item_id, serving_size_g, date; `food_item_id` references food_items.id)
 * - recipes (columns include id, name, g_amount, calories, g_protein, g_carbs, g_fats)
 *
 * Note: While fonts are loading this component returns null (renders nothing) until the SpaceMono font is ready.
 *
 * @returns The root React element for the application.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const createIfNeeded = async (db: SQLiteDatabase) => {
    console.log("creating food_items table if needed");
    await db.runAsync(
      "CREATE TABLE IF NOT EXISTS food_items (id INTEGER PRIMARY KEY AUTOINCREMENT, ean_id TEXT, name TEXT NOT NULL, brand TEXT, image_url TEXT, g_amount REAL, calories INT NOT NULL, g_protein INT NOT NULL, g_carbs INT NOT NULL, g_fats INT NOT NULL, g_fiber INT, g_sodium REAL, is_quick_add BOOLEAN, serving_quantity REAL, serving_unit TEXT);"
    )

    console.log("creating log_entries table if needed");
    await db.runAsync(
      "CREATE TABLE IF NOT EXISTS log_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, food_item_id INTEGER NOT NULL, log_serving REAL NOT NULL, date TEXT NOT NULL, FOREIGN KEY (food_item_id) REFERENCES food_items(id));"
    )

    console.log("creating recipes table if needed");
    await db.runAsync("CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, g_amount REAL NOT NULL, calories REAL NOT NULL, g_protein REAL NOT NULL, g_carbs REAL NOT NULL, g_fats REAL NOT NULL);")
  }

  return (
    <SQLiteProvider databaseName='scale.db' onInit={createIfNeeded}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="nutrition/[id]" options={{ headerTitle: "Nutrition facts", headerBackTitle: "Back" }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
