import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../recipe/recipe.schema.js';
import { CreateRecipeDto } from '../recipe/CreateRecipeDto.js';
import { PantryService } from '../pantry/pantry.service.js';
import { PantryItem } from '../pantry/pantryItem.schema.js';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private ai: GoogleGenAI;

  BASIC_INGREDIENTS = ['salt', 'pepper', 'water', 'olive oil', 'oil', 'butter', 'sugar', 'flour'];

  constructor(
    private readonly configService: ConfigService,
    private pantryService: PantryService,
    @InjectModel(Recipe.name)
    private recipeModel: Model<RecipeDocument>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateRecipe(ingredients: PantryItem[], cuisine: string): Promise<string> {
    const prompt = `
          You are an expert chef AI.
          The user pantry contains:
          ${ingredients.map((p) => p.name).join(', ')}

          Rules:
          1. Recipes MUST primarily use the user's pantry ingredients.
          2. You may assume these basic ingredients are always available:
          ${this.BASIC_INGREDIENTS.join(', ')}
          3. If more than TWO major ingredients are missing, do NOT create that recipe.
          4. Do NOT invent exotic ingredients.
          5. Create 5 different recipes.
          6. Return ONLY valid JSON.
          7. Response must be an array of objects structured exactly as:

          [
            {
              "title": string,
              "cuisine": string,
              "ingredients": string[],
              "steps": string[],
              "prepTime": number
            }
          ]

          No markdown.
          No explanations.
          No text outside JSON.`;

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

  async generateRecipeNew(userId: string, ingredients: string[], cuisine: string) {
    const pantry = await this.pantryService.getPantry(userId);
    const previousRecipes = await this.recipeModel
      .find({ user: userId })
      .select('title cuisine ingredients')
      .lean();

    const context = previousRecipes.map((r) => `- ${r.title} (${r.cuisine})`).join('\n');

    const prompt = `
        You are a professional chef AI.

        User pantry:
        ${pantry.map((p) => p.name).join(', ')}

        User previously liked recipes:
        ${context}

        Create a NEW ${cuisine} recipe.
        Avoid repeating previous titles.
        Use pantry ingredients where possible.
        `;

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
