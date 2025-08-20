import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

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
      "CREATE TABLE IF NOT EXISTS food_items (id INTEGER PRIMARY KEY AUTOINCREMENT, ean_id TEXT, name TEXT NOT NULL, brand TEXT, g_amount REAL, calories REAL NOT NULL, g_protein REAL NOT NULL, g_carbs REAL NOT NULL, g_fats REAL NOT NULL, g_fiber REAL, g_sodium REAL, is_quick_add BOOLEAN);"
    )

    console.log("creating log_entries table if needed");
    await db.runAsync(
      "CREATE TABLE IF NOT EXISTS log_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, food_item_id INTEGER NOT NULL, date TEXT NOT NULL, FOREIGN KEY (food_item_id) REFERENCES food_items(id));"
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
