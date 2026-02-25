import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateRecipe(ingredients: string[], cuisine: string): Promise<string> {
    const prompt = `
      You are a professional chef AI.

      Create a ${cuisine} recipe using ONLY these ingredients:
      ${ingredients.join(', ')}

      Return:
      - Title
      - Ingredients list
      - Step-by-step instructions
      - Estimated cooking time
      `;

    const result = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text ?? '';
    } catch (error) {
      console.error('Gemini error:', error);
      throw new InternalServerErrorException('Failed to generate recipe');
    }
  }

  async generateText(prompt: string): Promise<string> {
    this.logger.log('Generating text with Gemini (new SDK)');
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text ?? '';
    } catch (error) {
      this.logger.error('Gemini API error', error);
      throw error;
    }
  }
}
