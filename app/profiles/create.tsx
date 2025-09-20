import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import {
  ICreateProfileDto,
  IProfileController,
} from "@/core/profiles/profile.interface";
import { TYPES } from "@/core/types";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
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
  const [background, setBackground] = useState<string>("blank"); // Stores image URI or "blank"
  const [calorieGoal, setCalorieGoal] = useState<string>("0"); // Changed to string for TextInput
  const [proteinGoal, setProteinGoal] = useState<string>("0"); // Changed to string for TextInput
  const [fatGoal, setFatGoal] = useState<string>("0"); // Changed to string for TextInput
  const [carbGoal, setCarbGoal] = useState<string>("0"); // Changed to string for TextInput
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
      const newProfile: ICreateProfileDto = {
        name: profileName.trim(),
        background: background,
        calorie_goal: Number(calorieGoal),
        protein_goal: Number(proteinGoal),
        fat_goal: Number(fatGoal),
        carb_goal: Number(carbGoal),
      };
      await profileController.createProfile(newProfile);
      router.back();
    } catch (error) {
      console.error("Error creating profile:", error);
      Alert.alert("Error", "Failed to create profile. Please try again.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBackground(result.assets[0].uri);
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
        <TouchableOpacity
          style={[
            styles.input,
            styles.imagePickerButton,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          onPress={pickImage}
        >
          <Text
            style={{
              color:
                background !== "blank"
                  ? Colors[colorScheme ?? "light"].text
                  : Colors[colorScheme ?? "light"].text + "80",
              fontSize: 18,
            }}
          >
            {background === "blank"
              ? "Select Background Image"
              : "Image Selected"}
          </Text>
          {background !== "blank" && (
            <Image source={{ uri: background }} style={styles.thumbnail} />
          )}
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="Calorie Goal"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={calorieGoal}
          onChangeText={setCalorieGoal}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="Protein Goal"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={proteinGoal}
          onChangeText={setProteinGoal}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="Fat Goal"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={fatGoal}
          onChangeText={setFatGoal}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="Carb Goal"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={carbGoal}
          onChangeText={setCarbGoal}
          keyboardType="numeric"
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
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 5,
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
