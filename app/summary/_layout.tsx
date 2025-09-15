import { container } from "@/core/container";
import { IProfileController } from "@/core/profiles/profile.interface";
import { TYPES } from "@/core/types";
import { HeaderButton } from "@react-navigation/elements";
import { router, Stack, useFocusEffect } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
export default function SummaryLayout() {
  const profileController = container.get<IProfileController>(
    TYPES.IProfileController
  );

  const [currProfile, setCurrProfile] = useState<string>("A");

  const getCurrProfileChar = async () => {
    const activeProfile = await profileController.getActiveProfile();
    return activeProfile?.name.charAt(0);
  };

  useFocusEffect(() => {
    getCurrProfileChar().then((resp) => setCurrProfile(String(resp)));
  });

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
          headerRight: () => (
            <HeaderButton
              style={{
                flex: 0,
                width: 40, // Set a fixed width for the button
                height: 25, // Set a fixed height for the button
                justifyContent: "center", // Center content horizontally
                alignItems: "center", // Center content vertically
              }}
              onPress={() => router.navigate({ pathname: "/profiles" })}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 25,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                adjustsFontSizeToFit={true} // Allow font size to adjust
                numberOfLines={1} // Restrict to a single line
              >
                {currProfile}
              </Text>
            </HeaderButton>
          ),
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
