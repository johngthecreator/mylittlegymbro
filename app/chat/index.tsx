import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ChatService } from "../../core/llama/chat.service";
import { LlamaService } from "../../core/llama/llama.service";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function ChatScreen(): React.JSX.Element {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [selectedModelFormat, setSelectedModelFormat] = useState<string>("");
  const [selectedGGUF, setSelectedGGUF] = useState<string | null>(null);
  const [availableGGUFs, setAvailableGGUFs] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<
    "modelSelection" | "conversation"
  >("modelSelection");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);

  const llamaService = useMemo(
    () => new LlamaService((progress) => setProgress(progress)),
    []
  );
  const chatService = useMemo(
    () => new ChatService(llamaService),
    [llamaService]
  );

  useEffect(() => {
    setConversation(chatService.getConversation());
  }, [chatService]);

  const modelFormats = [
    { label: "Llama-3.2-1B-Instruct" },
    { label: "Qwen3-0.6B" },
    { label: "DeepSeek-R1-Distill-Qwen-1.5B" },
    { label: "SmolLM2-360M-Instruct" },
  ];

  const HF_TO_GGUF = {
    "Llama-3.2-1B-Instruct": "medmekk/Llama-3.2-1B-Instruct.GGUF",
    "DeepSeek-R1-Distill-Qwen-1.5B":
      "medmekk/DeepSeek-R1-Distill-Qwen-1.5B.GGUF",
    "Qwen3-0.6B": "unsloth/Qwen3-0.6B-GGUF",
    "SmolLM2-360M-Instruct": "HuggingFaceTB/SmolLM2-360M-Instruct-GGUF",
  };

  const handleFormatSelection = (format: string) => {
    setSelectedModelFormat(format);
    setAvailableGGUFs([]);
    fetchAvailableGGUFs(format);
  };

  const handleGGUFSelection = (file: string) => {
    setSelectedGGUF(file);
    Alert.alert(
      "Confirm Download",
      `Do you want to download ${file}?`,
      [
        {
          text: "No",
          onPress: () => setSelectedGGUF(null),
          style: "cancel",
        },
        { text: "Yes", onPress: () => handleDownloadAndNavigate(file) },
      ],
      { cancelable: false }
    );
  };

  const handleDownloadAndNavigate = async (file: string) => {
    setIsDownloading(true);
    setProgress(0);
    try {
      const repoPath =
        HF_TO_GGUF[selectedModelFormat as keyof typeof HF_TO_GGUF];
      const downloadUrl = `https://huggingface.co/${repoPath}/resolve/main/${file}`;

      const loaded = await llamaService.downloadAndLoadModel(file, downloadUrl);
      if (loaded) {
        setIsModelLoaded(true);
        setCurrentPage("conversation");
      } else {
        throw new Error("Failed to load model after download.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Download and load failed due to an unknown error.";
      Alert.alert("Error", errorMessage);
      setIsModelLoaded(false);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      setIsGenerating(true);
      await chatService.sendMessage(userInput, (token: string) => {
        // You can update UI with partial tokens here if needed
        // For now, we wait for the full response
      });
      setConversation(chatService.getConversation());
      setUserInput("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchAvailableGGUFs = async (modelFormat: string) => {
    if (!modelFormat) {
      Alert.alert("Error", "Please select a model format first.");
      return;
    }
    setIsFetching(true);
    try {
      const repoPath = HF_TO_GGUF[modelFormat as keyof typeof HF_TO_GGUF];
      if (!repoPath) {
        throw new Error(
          `No repository mapping found for model format: ${modelFormat}`
        );
      }

      const response = await fetch(
        `https://huggingface.co/api/models/${repoPath}`
      );
      const data = await response.json();

      if (!data?.siblings) {
        throw new Error("Invalid API response format");
      }

      const files = data.siblings.filter((file: { rfilename: string }) =>
        file.rfilename.endsWith(".gguf")
      );

      setAvailableGGUFs(
        files.map((file: { rfilename: string }) => file.rfilename)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch .gguf files";
      Alert.alert("Error", errorMessage);
      setAvailableGGUFs([]);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Llama Chat</Text>
        {/* Model Selection Section */}
        {currentPage === "modelSelection" && !isDownloading && (
          <View style={styles.card}>
            <Text style={styles.subtitle}>Choose a model format</Text>
            {modelFormats.map((format) => (
              <TouchableOpacity
                key={format.label}
                style={[
                  styles.button,
                  selectedModelFormat === format.label && styles.selectedButton,
                ]}
                onPress={() => handleFormatSelection(format.label)}
              >
                <Text style={styles.buttonText}>{format.label}</Text>
              </TouchableOpacity>
            ))}

            {selectedModelFormat && (
              <View>
                <Text style={styles.subtitle}>Select a .gguf file</Text>
                {isFetching && (
                  <ActivityIndicator size="small" color="#2563EB" />
                )}
                {availableGGUFs.map((file, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      selectedGGUF === file && styles.selectedButton,
                    ]}
                    onPress={() => handleGGUFSelection(file)}
                  >
                    <Text style={styles.buttonTextGGUF}>{file}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        {currentPage == "conversation" && !isDownloading && (
          <View style={styles.chatContainer}>
            <Text style={styles.greetingText}>
              🦙 Welcome! The Llama is ready to chat. Ask away! 🎉
            </Text>
            {conversation.slice(1).map((msg, index) => (
              <View key={index} style={styles.messageWrapper}>
                <View
                  style={[
                    styles.messageBubble,
                    msg.role === "user"
                      ? styles.userBubble
                      : styles.llamaBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.role === "user" && styles.userMessageText,
                    ]}
                  >
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {isDownloading && (
          <View style={styles.card}>
            <Text style={styles.subtitle}>Downloading : </Text>
            <Text style={styles.subtitle2}>{selectedGGUF}</Text>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}
      </ScrollView>
      {currentPage === "conversation" && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#94A3B8"
            value={userInput}
            onChangeText={setUserInput}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={isGenerating || !isModelLoaded}
            >
              <Text style={styles.buttonText}>
                {isGenerating ? "Sending..." : "Send"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E293B",
    marginVertical: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: "#475569",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 16,
    marginTop: 16,
  },
  subtitle2: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 16,
    color: "#93C5FD",
  },
  button: {
    backgroundColor: "#93C5FD", // Lighter blue
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#93C5FD", // Matching lighter shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15, // Slightly reduced opacity for subtle shadows
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedButton: {
    backgroundColor: "#2563EB",
  },
  buttonTextGGUF: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#3B82F6",
  },
  llamaBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: {
    fontSize: 16,
    color: "#334155",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  greetingText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 12,
    color: "#64748B", // Soft gray that complements #2563EB
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#334155",
  },
  sendButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  inputContainer: {
    flexDirection: "column",
    gap: 12,
    margin: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    textAlign: "center",
    marginTop: 12,
  },
});
