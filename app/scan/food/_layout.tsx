import { Stack, useRouter } from "expo-router";
import { Button } from "react-native";
export default function ScanLayout() {
  const router = useRouter();
  return (
    <Stack>
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
        name="[id]"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: "Food Details",
          headerBackButtonDisplayMode: "minimal",
          headerLeft: () => (
            <Button
              onPress={() => router.back()}
              title="Back"
              color={"white"}
            />
          ),
        }}
      />
    </Stack>
  );
}
