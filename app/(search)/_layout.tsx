import { Stack } from "expo-router";
export default function SummaryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="all-items"
        options={{
          title: "All Food",
          headerSearchBarOptions: {},
        }}
      />
    </Stack>
  );
}
