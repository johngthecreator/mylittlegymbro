import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import { IProfile } from "@/core/interfaces";
import { IProfileController } from "@/core/profiles/profile.interface";
import { TYPES } from "@/core/types";
import { useFocusEffect, useRouter } from "expo-router";
import { Container } from "inversify";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { IconSymbol } from "../../components/ui/IconSymbol";

const ITEM_LIMIT = 10; // Define item limit

function ProfilesScreen({ container }: { container: Container }) {
  const [profiles, setProfiles] = useState<IProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<IProfile | undefined>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const profileController = container.get<IProfileController>(
    TYPES.IProfileController
  );

  useFocusEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await profileController.getProfiles();
        const activeProfile = await profileController.getActiveProfile();
        setProfiles(data);
        setActiveProfile(activeProfile);
      } catch (error) {
        console.error("Error loading profiles: ", error);
      }
    };
    loadProfiles();
  });

  const handleProfilePress = async (profile: IProfile) => {
    await profileController.setActiveProfile(profile.id);
    setActiveProfile(profile);
    router.back();
  };

  const renderItem = ({ item }: { item: IProfile }) => (
    <TouchableOpacity
      style={[styles.profileItemContainer]}
      onPress={() => handleProfilePress(item)}
    >
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text
          style={[
            styles.profileName,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </View>
      {activeProfile?.id === item.id && (
        <IconSymbol
          name="checkmark.circle.fill"
          size={20}
          color={Colors[colorScheme ?? "light"].tint}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={profiles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
      contentContainerStyle={{
        paddingBottom: 100,
      }} // Adjusted paddingTop for header
      showsVerticalScrollIndicator={false}
    />
  );
}

export default withContainer(ProfilesScreen);

const styles = StyleSheet.create({
  profileItemContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 15,
    marginBottom: 10,
    borderRadius: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  createProfileButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 20,
  },
  createProfileButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
