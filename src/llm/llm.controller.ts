import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service.js';

@Controller()
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('/generate')
  async generate(@Body('prompt') prompt: string): Promise<string> {
    if (!prompt) {
      throw new Error('Prompt is required');
    }
    return await this.llmService.generateText(prompt);
  }
}
