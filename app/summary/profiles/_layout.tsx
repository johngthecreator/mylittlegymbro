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
          headerLargeTitle: false,
          headerTransparent: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: "Profiles",
          headerLeft: () => (
            <HeaderButton onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={30} color={"white"} />
            </HeaderButton>
          ),
          headerRight: () => (
            <HeaderButton
              onPress={() =>
                router.navigate({ pathname: "/summary/profiles/create" })
              }
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
          headerBackButtonDisplayMode: "minimal",
          headerTitle: "Create Profile",
        }}
      />

      <Stack.Screen
        name="edit/[id]"
        options={{
          headerShown: true,
          headerLargeTitle: false,
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
          headerTitle: "Edit Profile",
        }}
      />
    </Stack>
  );
}
