import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import {
  ICreateProfileDto,
  IProfileController,
} from "@/core/profiles/profile.interface";
import { TYPES } from "@/core/types";
import { HeaderButton } from "@react-navigation/elements";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { Container } from "inversify";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import defaultBackground from "../../assets/images/default_background.jpeg";

function CreateProfileScreen({ container }: { container: Container }) {
  const [profileName, setProfileName] = useState<string>("");
  const [background, setBackground] = useState<string>("blank"); // Stores image URI or "blank"
  const [calorieGoal, setCalorieGoal] = useState<string>("0"); // Changed to string for TextInput
  const [proteinGoal, setProteinGoal] = useState<string>("0"); // Changed to string for TextInput
  const [fatGoal, setFatGoal] = useState<string>("0"); // Changed to string for TextInput
  const [carbGoal, setCarbGoal] = useState<string>("0"); // Changed to string for TextInput
  const [isPickingImage, setIsPickingImage] = useState<boolean>(false); // New state for loading indicator
  const navigation = useNavigation();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const profileController = container.get<IProfileController>(
    TYPES.IProfileController
  );

  const handleCreateProfile = useCallback(async () => {
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
  }, [profileName, background, calorieGoal, proteinGoal, fatGoal, carbGoal]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={handleCreateProfile}>
          <IconSymbol name="checkmark" size={20} color={"white"} />
        </HeaderButton>
      ),
    });
  }, [handleCreateProfile, colorScheme]);

  const pickImage = async () => {
    setIsPickingImage(true); // Set loading to true
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setBackground(result.assets[0].uri);
    }
    setIsPickingImage(false); // Set loading to false
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      automaticallyAdjustKeyboardInsets={true}
    >
      <View>
        <View style={{ display: "flex", alignItems: "center" }}>
          <TouchableOpacity
            onPress={pickImage}
            disabled={isPickingImage} // Disable button while loading
          >
            <Image
              source={
                background !== "blank" ? { uri: background } : defaultBackground
              }
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Profile Name</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="Your Name or Profile Title"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={profileName}
          onChangeText={setProfileName}
        />
        <Text style={styles.label}>Calories Goal</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="2000"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={calorieGoal}
          onChangeText={setCalorieGoal}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Protein Goal</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="150"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={proteinGoal}
          onChangeText={setProteinGoal}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Fat Goal</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="60"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={fatGoal}
          onChangeText={setFatGoal}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Carbohydrate Goal</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: Colors[colorScheme ?? "light"].tint },
          ]}
          placeholder="200"
          placeholderTextColor={Colors[colorScheme ?? "light"].text + "80"}
          value={carbGoal}
          onChangeText={setCarbGoal}
          keyboardType="numeric"
        />
      </View>
    </ScrollView>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    color: Colors.light.text,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 5,
    backgroundColor: "#3A3A3A", // Added for consistency
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
    height: 50, // Match input height
    paddingHorizontal: 15,
  },
  thumbnail: {
    width: 150,
    height: 300,
    borderRadius: 16,
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
