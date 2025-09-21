import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { HeaderButton } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
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
          headerTitle: "Profiles",
          headerRight: () => (
            <HeaderButton
              onPress={() => router.navigate({ pathname: "/profiles/create" })}
            >
              <IconSymbol name="plus" size={30} color={"white"} />
            </HeaderButton>
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerShown: true,
          headerLargeTitle: false,
          headerTransparent: true,
          headerTitle: "Create Profile",
        }}
      />

      <Stack.Screen
        name="edit/[id]"
        options={{
          headerShown: true,
          headerLargeTitle: false,
          headerTransparent: true,
          headerTitle: "Edit Profile",
        }}
      />
    </Stack>
  );
}
