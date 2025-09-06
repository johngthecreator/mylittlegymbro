import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image
        style={styles.profileImage}
      />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.bio}>
        This is a placeholder bio for John Doe. You can update this with actual
        user information.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1A1A1A", // Dark background to match your app's theme
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular image
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#3A3A3A",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#808080",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default ProfileScreen;
