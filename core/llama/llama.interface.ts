export interface ILlamaController {
  dataExtraction(
    systemPrompt: string,
    userInput: string,
    onToken?: (token: string) => void
  ): Promise<string>;
}
export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ILlamaService {
  downloadAndLoadModel(modelName: string, modelUrl: string): Promise<boolean>;
  loadModel(modelName: string): Promise<boolean>;
  generateCompletion(
    messages: Message[],
    onToken?: (token: string) => void
  ): Promise<string>;
  releaseModel(): Promise<void>;
  isModelLoaded(): Promise<boolean>;
  isModelFilePresent(modelName: string): Promise<boolean>;
  generateWithSystemPrompt(
    systemPrompt: string,
    userInput: string,
    onToken?: (token: string) => void
  ): Promise<string>;
  readonly DEFAULT_LLAMA_MODEL_NAME: string;
  readonly DEFAULT_LLAMA_MODEL_URL: string;
  deleteModel(): Promise<void>;
}

export interface IMeasurement {
  amount: number | string;
  unit: string;
}

export interface INutritionalData {
  serving_size: IMeasurement;
  protein: IMeasurement;
  total_fat: IMeasurement;
  total_carbohydrate: IMeasurement;
}
