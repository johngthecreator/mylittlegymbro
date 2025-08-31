import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ScanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight: () => (
            <Link href="/scan/all-items" asChild>
              <Pressable>
                <Feather name="list" size={24} color="black" />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="[id]" options={{ headerTitle: "Scan Details" }} />
      <Stack.Screen name="all-items" options={{ headerTitle: "All Items" }} />
    </Stack>
  );
}

