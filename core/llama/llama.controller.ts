import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILlamaController, ILlamaService } from "./llama.interface";

@injectable()
export class LlamaController implements ILlamaController {
  constructor(
    @inject(TYPES.ILlamaService) private llamaService: ILlamaService
  ) {}

  async dataExtraction(
    systemPrompt: string,
    userInput: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    return this.llamaService.generateWithSystemPrompt(
      systemPrompt,
      userInput,
      onToken
    );
  }
}
