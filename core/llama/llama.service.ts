import { Directory, File, Paths } from "expo-file-system";
import { injectable } from "inversify";
import {
  convertJsonSchemaToGrammar,
  initLlama,
  releaseAllLlama,
} from "llama.rn";
import { ILlamaService, Message } from "./llama.interface";

const NUTRITIONAL_DATA_SCHEMA = {
  schema: {
    type: "object",
    properties: {
      serving_size: {
        type: "object",
        properties: {
          amount: { type: "number" },
          unit: { type: "string" },
        },
        required: ["amount", "unit"],
      },
      protein: {
        type: "object",
        properties: {
          amount: { type: "number" },
          unit: { type: "string" },
        },
        required: ["amount", "unit"],
      },
      total_fat: {
        type: "object",
        properties: {
          amount: { type: "number" },
          unit: { type: "string" },
        },
        required: ["amount", "unit"],
      },
      total_carbohydrate: {
        type: "object",
        properties: {
          amount: { type: "number" },
          unit: { type: "string" },
        },
        required: ["amount", "unit"],
      },
    },
    required: ["serving_size", "protein", "total_fat", "total_carbohydrate"],
    additionalProperties: false,
  },
};

export const DEFAULT_LLAMA_MODEL_NAME = "Qwen3-0.6B-Q4_K_M.gguf";
export const DEFAULT_LLAMA_MODEL_URL =
  "https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q4_K_M.gguf";

@injectable()
export class LlamaService implements ILlamaService {
  constructor() {
    this.cachedGrammar = convertJsonSchemaToGrammar(NUTRITIONAL_DATA_SCHEMA);
  }
  private async _releaseModel(): Promise<void> {
    if (this.context) {
      this.context = null; // Set JavaScript context to null first
      await releaseAllLlama(); // Then await the global native release
    }
  }
  public readonly DEFAULT_LLAMA_MODEL_NAME = DEFAULT_LLAMA_MODEL_NAME;
  public readonly DEFAULT_LLAMA_MODEL_URL = DEFAULT_LLAMA_MODEL_URL;
  private context: any = null;
  private cachedGrammar: any = null;

  dataExtraction(text: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async _performDownload(
    modelName: string,
    modelUrl: string
  ): Promise<string> {
    const destDirectory = new Directory(Paths.document, "");
    const destFile = new File(destDirectory, modelName);
    const destPath = destFile.uri;
    try {
      if (!modelName || !modelUrl) {
        throw new Error("Invalid model name or URL");
      }

      if (destFile.exists) {
        console.log(`Model already exists at ${destPath}, skipping download.`);
        return destPath;
      }

      console.log("Starting download from:", modelUrl);
      const downloadResult = await File.downloadFileAsync(modelUrl, destFile);

      if (downloadResult?.uri) {
        return downloadResult.uri;
      } else {
        throw new Error(`Download failed with no URI: ${downloadResult}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to download model: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  public async downloadAndLoadModel(
    modelName: string,
    modelUrl: string
  ): Promise<boolean> {
    try {
      const destPath = await this._performDownload(modelName, modelUrl);
      if (destPath) {
        return await this.loadModel(modelName);
      } else {
        throw new Error("Model download path is invalid.");
      }
    } catch (error) {
      console.error("Error downloading and loading model:", error);
      throw error;
    }
  }

  public async loadModel(modelName: string): Promise<boolean> {
    try {
      const destDirectory = new Directory(Paths.document, "");
      const destFile = new File(destDirectory, modelName);
      const destPath = destFile.uri;

      if (!destFile.exists) {
        throw new Error("The model file does not exist.");
      }

      // Only load if not already loaded
      if (this.context) {
        console.log("Model already loaded, skipping reload.");
        return true;
      }

      this.context = await initLlama({
        model: destPath,
        use_mlock: true,
        n_ctx: 2048,
        n_gpu_layers: 1,
      });
      return true;
    } catch (error) {
      console.error("Error loading model:", error);
      throw error;
    }
  }

  public async generateCompletion(
    messages: Message[],
    onToken?: (token: string) => void
  ): Promise<string> {
    if (!this.context) {
      throw new Error("Model not loaded. Please load the model first.");
    }

    const stopWords = [
      "</s>",
      "<|end|>",
      "user:",
      "assistant:",
      "<|im_end|>",
      "<|eot_id|>",
      "<|end of sentence|>",
      "<｜end of sentence｜>",
    ];

    try {
      const result = await this.context.completion(
        {
          messages: messages,
          n_predict: 10000,
          stop: stopWords,
          jinja: true, // Enable Jinja template parser
          tool_choice: "auto",
          grammar: await convertJsonSchemaToGrammar(NUTRITIONAL_DATA_SCHEMA),
        },
        (data: { token: string }) => {
          if (onToken) {
            onToken(data.token);
          }
        }
      );
      if (result && result.text) {
        const parsedResult = JSON.parse(result.text);
        // console.log(`${parsedResult.name} : ${parsedResult.age}`);
        return result.text.trim();
      } else {
        throw new Error("No response from the model.");
      }
    } catch (error) {
      console.error("Error during inference:", error);
      throw error;
    }
  }

  public async isModelLoaded(): Promise<boolean> {
    return (
      this.context !== null &&
      (await this.isModelFilePresent(this.DEFAULT_LLAMA_MODEL_NAME))
    );
  }

  public async isModelFilePresent(modelName: string): Promise<boolean> {
    const destDirectory = new Directory(Paths.document, "");
    const destFile = new File(destDirectory, modelName);
    return destFile.exists;
  }

  public async generateWithSystemPrompt(
    systemPrompt: string,
    userInput: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    // Ensure the model is downloaded and loaded if not already.
    if (!(await this.isModelLoaded())) {
      await this.downloadAndLoadModel(
        DEFAULT_LLAMA_MODEL_NAME,
        DEFAULT_LLAMA_MODEL_URL
      );
    }

    if (!this.context) {
      throw new Error(
        "Model not loaded after attempt. Please ensure model can be downloaded and loaded."
      );
    }

    const formattedPrompt = `<<SYS>>\n${systemPrompt}\n<</SYS>>\n\n[INST] ${userInput}\n[/INST]`;
    const messages: Message[] = [{ role: "user", content: formattedPrompt }];

    const stopWords = [
      "</s>",
      "<|end|>",
      "user:",
      "assistant:",
      "<|im_end|>",
      "<|eot_id|>",
      "<|end of sentence|>",
      "<｜end of sentence｜>",
    ];

    try {
      const result = await this.context.completion(
        {
          messages: messages,
          n_predict: 10000,
          stop: stopWords,
          jinja: true, // Enable Jinja template parser
          tool_choice: "auto",
          grammar: this.cachedGrammar, // Use cached grammar instead of recreating
        },
        (data: { token: string }) => {
          if (onToken) {
            onToken(data.token);
          }
        }
      );
      if (result && result.text) {
        return result.text.trim();
      } else {
        throw new Error("No response from the model.");
      }
    } catch (error) {
      console.error("Error during inference with system prompt:", error);
      throw error;
    }
  }

  public async deleteModel(): Promise<void> {
    try {
      if (this.context) {
        await this._releaseModel(); // Use the internal release method
      }
      const destDirectory = new Directory(Paths.document, "");
      const destFile = new File(destDirectory, this.DEFAULT_LLAMA_MODEL_NAME);

      if (destFile.exists) {
        await destFile.delete();
        console.log("Model deleted successfully.");
      } else {
        console.log("Model file does not exist, nothing to delete.");
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      throw new Error(
        `Failed to delete model: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
