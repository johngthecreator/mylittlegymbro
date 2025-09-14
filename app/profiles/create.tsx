import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import {
  ICreateProfileDto,
  IProfileController,
} from "@/core/profiles/profile.interface";
import { TYPES } from "@/core/types";
import { useRouter } from "expo-router";
import { Container } from "inversify";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CreateProfileScreen({ container }: { container: Container }) {
  const [profileName, setProfileName] = useState<string>("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const profileController = container.get<IProfileController>(
    TYPES.IProfileController
  );

  const handleCreateProfile = async () => {
    if (!profileName.trim()) {
      Alert.alert("Error", "Profile name cannot be empty.");
      return;
    }

    try {
      const newProfile: ICreateProfileDto = { name: profileName.trim() };
      await profileController.createProfile(newProfile);
      router.back();
    } catch (error) {
      console.error("Error creating profile:", error);
      Alert.alert("Error", "Failed to create profile. Please try again.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <View style={{ paddingTop: insets.top + 50 }}>
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="Profile Name"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={profileName}
          onChangeText={setProfileName}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateProfile}>
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default withContainer(CreateProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
