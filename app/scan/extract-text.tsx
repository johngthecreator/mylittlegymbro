import { launchImageLibraryAsync } from "expo-image-picker";
import { extractTextFromImage, isSupported } from "expo-text-extractor";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TextractScreen() {
  console.log("App component mounted.");
  const [result, setResult] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (result) {
      let allText = "";
      result.forEach((line) => {
        allText = allText + " " + line;
      });
      console.log(allText);
    }
  }, [result]);

  const processImage = async (path?: string) => {
    console.log("processImage started with path:", path);
    if (!path) return;

    setImageUri(path);
    setIsLoading(true);
    setResult([]);

    if (isSupported) {
      console.log("Text extraction is supported. Attempting extraction...");
      try {
        const extractedTexts = await extractTextFromImage(path);
        setResult(extractedTexts);
        console.log(
          "Text extraction successful, results count:",
          extractedTexts.length
        );
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Text Extraction Error", error.message);
          console.error("Text extraction error:", error.message);
        } else {
          console.error("Unknown error during text extraction:", error);
        }
      } finally {
        setIsLoading(false);
        console.log("Text extraction process finished.");
      }
    } else {
      setIsLoading(false);
      Alert.alert(
        "Not Supported",
        "Text extraction is not supported on this device"
      );
      console.warn("Text extraction not supported on this device.");
    }
  };

  const handleImagePick = useCallback(async () => {
    console.log("handleImagePick initiated.");
    setIsLoading(true); // Set loading to true
    try {
      console.log("Launching image library...");
      const result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        const path = result.assets?.at(0)?.uri;
        console.log("Image picked, URI:", path);
        await processImage(path);
      } else {
        console.log("Image picking canceled.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Image Pick Error", error.message);
        console.error("Image pick error:", error.message);
      } else {
        console.error("Unknown error during image picking:", error);
      }
    } finally {
      setIsLoading(false); // Set loading to false
    }
  }, [processImage]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.imageContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleImagePick}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Pick Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.previewContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.placeholderText}>No image selected</Text>
          )}
        </View>
      </View>
      <ScrollView
        style={styles.resultsContainer}
        contentContainerStyle={styles.scrollContainer}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6858e9" />
            <Text style={styles.loadingText}>Extracting text...</Text>
          </View>
        ) : result.length > 0 ? (
          result.map((line, index) => (
            <Text key={index}>
              {index} | {line}
            </Text>
          ))
        ) : (
          <Text style={styles.noResultsText}>No text detected</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    rowGap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
  },
  button: {
    backgroundColor: "#6858e9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#b3aedb",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  placeholderText: {
    fontSize: 16,
    color: "#888",
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  scrollContainer: {
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#6858e9",
  },
  noResultsText: {
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});
