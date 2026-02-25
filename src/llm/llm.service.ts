import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class LlmService {
    private readonly logger = new Logger(LlmService.name);
    private ai: GoogleGenAI;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    
        if (!apiKey) {
          throw new Error('GEMINI_API_KEY is not set');
        }
    
        this.ai = new GoogleGenAI({});
      }

    async generateText(prompt: string): Promise<string> {
       this.logger.log('Generating text with Gemini (new SDK)');

        try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text ?? '';
        
        } catch (error) {
        this.logger.error('Gemini API error', error);
        throw error;
        }
    }
}