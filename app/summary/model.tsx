import { Stack, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";
import { container } from "../../core/container";
import { ILlamaService } from "../../core/llama/llama.interface";
import { TYPES } from "../../core/types";

const LlamaModelSettings = () => {
  const navigation = useNavigation();
  const llamaService = container.get<ILlamaService>(TYPES.ILlamaService);
  const [isModelDownloaded, setIsModelDownloaded] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkModelStatus();
  }, []);

  const checkModelStatus = async () => {
    setIsModelDownloaded(
      await llamaService.isModelFilePresent(
        llamaService.DEFAULT_LLAMA_MODEL_NAME
      )
    );
  };

  const handleDownloadModel = async () => {
    setIsLoading(true);
    try {
      await llamaService.downloadAndLoadModel(
        llamaService.DEFAULT_LLAMA_MODEL_NAME,
        llamaService.DEFAULT_LLAMA_MODEL_URL
      );
      Alert.alert("Success", "Model downloaded and loaded successfully!");
      checkModelStatus();
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert("Error", "Failed to download model.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModel = async () => {
    setIsLoading(true);
    try {
      await llamaService.deleteModel();
      Alert.alert("Success", "Model deleted successfully!");
      checkModelStatus();
    } catch (error) {
      console.error("Delete failed:", error);
      Alert.alert("Error", "Failed to delete model.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Llama Model Settings" }} />
      {isModelDownloaded === null ? (
        <ActivityIndicator size="large" />
      ) : isModelDownloaded ? (
        <Text style={{ color: "white" }}>Model Downloaded!</Text>
      ) : (
        <Text style={{ color: "white" }}>Model Not Downloaded!</Text>
      )}
      <Button
        title="Download Model"
        onPress={handleDownloadModel}
        disabled={isLoading}
      />
      <Button
        title="Delete Model"
        onPress={handleDeleteModel}
        disabled={isLoading}
      />
    </View>
  );
};

export default LlamaModelSettings;
