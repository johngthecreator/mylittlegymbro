import { Stack } from "expo-router";
export default function ScanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, headerTitle: "Scanner" }}
      />
      <Stack.Screen name="[id]" options={{ headerTitle: "Scan Details" }} />
    </Stack>
  );
}
