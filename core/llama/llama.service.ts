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

@injectable()
export class LlamaService implements ILlamaService {
  private context: any = null;
  private onProgressCallback: ((progress: number) => void) | null = null;

  constructor(onProgress?: (progress: number) => void) {
    if (onProgress) {
      this.onProgressCallback = onProgress;
    }
  }
  dataExtraction(text: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public setOnProgressCallback(callback: (progress: number) => void) {
    this.onProgressCallback = callback;
  }

  private async _handleDownloadProgress(progress: number) {
    if (this.onProgressCallback) {
      this.onProgressCallback(progress);
    }
  }

  private async _performDownload(
    modelName: string,
    modelUrl: string,
    onProgress: (progress: number) => void
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
      const destPath = await this._performDownload(
        modelName,
        modelUrl,
        this._handleDownloadProgress.bind(this)
      );
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

      if (this.context) {
        await releaseAllLlama();
        this.context = null;
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

  public releaseModel(): Promise<void> {
    if (this.context) {
      this.context = null;
      return releaseAllLlama();
    }
    return Promise.resolve();
  }

  public isModelLoaded(): boolean {
    return this.context !== null;
  }

  public async generateWithSystemPrompt(
    systemPrompt: string,
    userInput: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    if (!this.context) {
      throw new Error("Model not loaded. Please load the model first.");
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
          grammar: await convertJsonSchemaToGrammar(NUTRITIONAL_DATA_SCHEMA),
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
}
