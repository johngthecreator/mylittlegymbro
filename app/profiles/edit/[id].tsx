import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import {
  ICreateProfileDto,
  IProfileController,
} from "@/core/profiles/profile.interface";
import { TYPES } from "@/core/types";
import { useFocusEffect } from "@react-navigation/native"; // Added useFocusEffect
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router"; // Added useLocalSearchParams
import { Container } from "inversify";
import { useCallback, useState } from "react"; // Added useCallback
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EditProfileScreen({ container }: { container: Container }) {
  const params = useLocalSearchParams<{ id: string }>(); // Get ID from route params
  const [profileName, setProfileName] = useState<string>("");
  const [background, setBackground] = useState<string>("blank"); // Stores image URI or "blank"
  const [calorieGoal, setCalorieGoal] = useState<string>("0"); // Changed to string for TextInput
  const [proteinGoal, setProteinGoal] = useState<string>("0"); // Changed to string for TextInput
  const [fatGoal, setFatGoal] = useState<string>("0"); // Changed to string for TextInput
  const [carbGoal, setCarbGoal] = useState<string>("0"); // Changed to string for TextInput
  const [isPickingImage, setIsPickingImage] = useState<boolean>(false); // New state for loading indicator
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const profileController = container.get<IProfileController>(
    TYPES.IProfileController
  );

  const loadProfileData = useCallback(async () => {
    if (!params.id) return;
    try {
      const profile = await profileController.getProfileById(Number(params.id));
      if (profile) {
        setProfileName(profile.name);
        setBackground(profile.background || "blank");
        setCalorieGoal(String(profile.calorie_goal || 0));
        setProteinGoal(String(profile.protein_goal || 0));
        setFatGoal(String(profile.fat_goal || 0));
        setCarbGoal(String(profile.carb_goal || 0));
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      Alert.alert("Error", "Failed to load profile. Please try again.");
    }
  }, [params.id]);

  useFocusEffect(loadProfileData);

  const handleUpdateProfile = async () => {
    if (!profileName.trim()) {
      Alert.alert("Error", "Profile name cannot be empty.");
      return;
    }
    if (!params.id) return;

    try {
      const updatedProfile: ICreateProfileDto = {
        name: profileName.trim(),
        background: background,
        calorie_goal: Number(calorieGoal),
        protein_goal: Number(proteinGoal),
        fat_goal: Number(fatGoal),
        carb_goal: Number(carbGoal),
      };
      await profileController.updateProfile(Number(params.id), updatedProfile); // New update method
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleDeleteProfile = async () => {
    if (!params.id) return;
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this profile? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await profileController.deleteProfile(Number(params.id));
              router.back();
            } catch (error) {
              console.error("Error deleting profile:", error);
              Alert.alert(
                "Error",
                "Failed to delete profile. Please try again."
              );
            }
          },
        },
      ]
    );
  };

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
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <View style={{ paddingTop: insets.top + 50 }}>
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
        <Text style={styles.label}>Background Image</Text>
        <GlassView glassEffectStyle="regular" tintColor="light">
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
            disabled={isPickingImage} // Disable button while loading
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
            {isPickingImage && (
              <ActivityIndicator
                size="small"
                color={Colors[colorScheme ?? "light"].tint}
                style={{ marginLeft: 10 }}
              />
            )}
            {background !== "blank" && !isPickingImage && (
              <Image source={{ uri: background }} style={styles.thumbnail} />
            )}
          </TouchableOpacity>
        </GlassView>

        <View style={styles.goalsGridContainer}>
          <View style={styles.goalsGridRow}>
            <View style={styles.goalGridItem}>
              <Text style={styles.macroLabel}>Calories</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.goalInput,
                  { borderColor: Colors[colorScheme ?? "light"].tint },
                ]}
                placeholder="2000"
                placeholderTextColor={
                  Colors[colorScheme ?? "light"].text + "80"
                }
                value={calorieGoal}
                onChangeText={setCalorieGoal}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.goalGridItem}>
              <Text style={styles.macroLabel}>Protein</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.goalInput,
                  { borderColor: Colors[colorScheme ?? "light"].tint },
                ]}
                placeholder="150"
                placeholderTextColor={
                  Colors[colorScheme ?? "light"].text + "80"
                }
                value={proteinGoal}
                onChangeText={setProteinGoal}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.goalsGridRow}>
            <View style={styles.goalGridItem}>
              <Text style={styles.macroLabel}>Fat</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.goalInput,
                  { borderColor: Colors[colorScheme ?? "light"].tint },
                ]}
                placeholder="60"
                placeholderTextColor={
                  Colors[colorScheme ?? "light"].text + "80"
                }
                value={fatGoal}
                onChangeText={setFatGoal}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.goalGridItem}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.goalInput,
                  { borderColor: Colors[colorScheme ?? "light"].tint },
                ]}
                placeholder="200"
                placeholderTextColor={
                  Colors[colorScheme ?? "light"].text + "80"
                }
                value={carbGoal}
                onChangeText={setCarbGoal}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          {" "}
          {/* Changed to handleUpdateProfile */}
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteProfile}
        >
          <Text style={styles.deleteButtonText}>Delete Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default withContainer(EditProfileScreen); // Changed component name

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
    marginBottom: 20,
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
  glassButtonContainer: {
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden", // Ensures content respects borderRadius
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  goalsGridContainer: {
    marginBottom: 20,
  },
  goalsGridRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    gap: 10,
  },
  goalGridItem: {
    flex: 1,
    alignItems: "center",
  },
  goalInput: {
    textAlign: "center",
    marginBottom: 0, // Override default input marginBottom
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: Colors.light.text,
  },
  macroInput: {
    flex: 1,
    marginBottom: 0, // Override default input marginBottom
    textAlign: "center", // Center the text within the input
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
  deleteButton: {
    backgroundColor: "red",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
