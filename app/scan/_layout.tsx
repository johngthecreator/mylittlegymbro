import { Stack } from "expo-router";
export default function ScanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: "Edit Food",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="food/[id]"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: "Food Details",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
