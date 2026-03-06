import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipeService } from './recipe.service.js';
import { CreateRecipeDto } from './CreateRecipeDto.js';
import { Recipe, RecipeDocument } from './recipe.schema.js';

export class RecipeResponseDto {
  title: string;
  cuisine: string;
  ingredients: string[];
  steps: string[];
  prepTime?: number;
  favorite: boolean;
}

@Controller('recipe')
@UseGuards(AuthGuard('jwt'))
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  async addRecipe(@Req() req, @Body() createRecipe: CreateRecipeDto) {
    return await this.recipeService.addRecipe(req.user.userId, createRecipe);
  }

  @Get()
  async getRecipes(@Req() req): Promise<RecipeResponseDto[]> {
    const recipes = await this.recipeService.getRecipes(req.user.userId);

    return recipes.map((r) => ({
      title: r.title,
      cuisine: r.cuisine,
      ingredients: r.ingredients,
      steps: r.steps,
      prepTime: r.prepTime,
      favorite: r.favorite,
    }));
  }
}
