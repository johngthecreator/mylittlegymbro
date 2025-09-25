import { LlamaService } from "./llama.service";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const INITIAL_CONVERSATION: Message[] = [
  {
    role: "system",
    content:
      "This is a conversation between user and assistant, a friendly chatbot.",
  },
];

export class ChatService {
  private llamaService: LlamaService;
  private conversation: Message[] = INITIAL_CONVERSATION;

  constructor(llamaService: LlamaService) {
    this.llamaService = llamaService;
  }

  public getConversation(): Message[] {
    return this.conversation;
  }

  public resetConversation(): void {
    this.conversation = INITIAL_CONVERSATION;
  }

  public async sendMessage(
    userInput: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    if (!this.llamaService.isModelLoaded()) {
      throw new Error("Model Not Loaded. Please load the model first.");
    }

    if (!userInput.trim()) {
      throw new Error("Please enter a message.");
    }

    const newUserMessage: Message = { role: "user", content: userInput };
    this.conversation = [...this.conversation, newUserMessage];

    try {
      const assistantResponse = await this.llamaService.generateCompletion(
        this.conversation,
        onToken
      );
      const newAssistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
      };
      this.conversation = [...this.conversation, newAssistantMessage];
      return assistantResponse;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}
