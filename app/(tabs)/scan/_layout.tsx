import { Feather } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

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
                <Feather name="list" size={24} color="white" />
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
