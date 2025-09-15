import { Stack, useRouter } from "expo-router";
export default function SummaryLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="all-items"
        options={{
          title: "All Food",
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerSearchBarOptions: {
            onChangeText: (event) => {
              router.setParams({ q: event.nativeEvent.text });
            },
            placement: "inline",
          },
        }}
      />
    </Stack>
  );
}
