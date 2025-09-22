import { Stack, useRouter } from "expo-router";
export default function ScanLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerLargeTitle: false, // Set to false to prevent overlap with Food Details
          headerTitle: "",
          headerBackButtonDisplayMode: "minimal",
          // headerRight: () => (
          //   <HeaderButton
          //     onPress={() => router.navigate({ pathname: "/scan/all-items" })}
          //   >
          //     <Text style={{ color: "white" }}>All Food</Text>
          //   </HeaderButton>
          // ),
        }}
      />
      <Stack.Screen
        name="food"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="extract-text" />
    </Stack>
  );
}
