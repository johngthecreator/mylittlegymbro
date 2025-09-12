import { Stack } from "expo-router";
export default function SummaryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: "Summary",
        }}
      />
      <Stack.Screen
        name="all-items"
        options={{
          headerShown: true,
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: "All Items",
        }}
      />
      <Stack.Screen
        name="quick-add"
        options={{
          headerShown: true,
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: "Quick Add",
        }}
      />
    </Stack>
  );
}
