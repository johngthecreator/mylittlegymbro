import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  const colorScheme = "dark";

  return (
    // <Tabs
    //   initialRouteName="index" // Set 'index' as the initial route for the Home tab
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //     tabBarStyle: {
    //       backgroundColor: "#3A3A3A",
    //     },
    //   }}
    // >
    //   <Tabs.Screen
    //     name="scan"
    //     options={{
    //       title: "Scanner",
    //       tabBarLabel: "Scanner",
    //       tabBarIcon: ({ color }) => (
    //         <IconSymbol size={28} name="magnifyingglass" color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: "Home",
    //       tabBarLabel: "Home",
    //       tabBarIcon: ({ color }) => (
    //         <IconSymbol size={28} name="house.fill" color={color} />
    //       ),
    //     }}
    //   />
    //   {/* Add your profile tab here */}
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       title: "Profile",
    //       tabBarLabel: "Profile",
    //       tabBarIcon: ({ color }) => (
    //         <IconSymbol size={28} name="person.fill" color={color} />
    //       ),
    //     }}
    //   />
    // </Tabs>
    <NativeTabs>
      <NativeTabs.Trigger name="scan">
        <Icon sf="magnifyingglass" drawable="custom_settings_drawable" />
        <Label>Scanner</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="index">
        <Label>Food Log</Label>
        <Icon sf="book.pages.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
