import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './recipe.schema.js';
import { CreateRecipeDto } from './CreateRecipeDto.js';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private recipeModel: Model<RecipeDocument>,
  ) {}

  async addRecipe(userId: string, newRecipe: CreateRecipeDto) {
    const recipe = await this.recipeModel.create({
      ...newRecipe,
      user: userId,
    });

    return this.recipeModel.find({ user: userId });
  }

  async getRecipes(userId: string): Promise<Recipe[]> {
    return this.recipeModel.find({ user: userId }).select('-user').lean();
  }
}
