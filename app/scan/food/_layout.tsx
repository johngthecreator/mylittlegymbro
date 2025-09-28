import { HeaderBackButton } from "@react-navigation/elements";
import { Stack, useRouter } from "expo-router";
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
          headerLargeTitle: false,
          headerTitle: "Edit Food",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="edit/extract/[id]"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
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
          headerLargeTitle: false,
          headerTitle: "Food Details",
          headerBackButtonDisplayMode: "minimal",
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => router.back()}
              tintColor="white"
            />
          ),
        }}
      />
    </Stack>
  );
}
