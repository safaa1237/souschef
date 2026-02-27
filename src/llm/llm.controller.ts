import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { LlmService } from './llm.service.js';
import { PantryService } from '../pantry/pantry.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('souschef')
@UseGuards(AuthGuard('jwt'))
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly pantryService: PantryService,
  ) {}

  @Post('/generate')
  async generate(@Body('prompt') prompt: string): Promise<string> {
    if (!prompt) {
      throw new Error('Prompt is required');
    }
    return await this.llmService.generateText(prompt);
  }
  @Post()
  async generateRecipes(@Req() req, @Body('cuisine') cuisine: string): Promise<string> {
    const pantryItems = await this.pantryService.getPantry(req.user.userId);
    return await this.llmService.generateRecipe(pantryItems, cuisine);
  }
}
