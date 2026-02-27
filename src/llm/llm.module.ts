import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmService } from './llm.service.js';
import { LlmController } from './llm.controller.js';
import { RecipeModule } from '../recipe/recipe.module.js';
import { PantryModule } from '../pantry/pantry.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from '../recipe/recipe.schema.js';

@Module({
  imports: [
    ConfigModule,
    RecipeModule,
    PantryModule,
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
  providers: [LlmService],
  exports: [LlmService],
  controllers: [LlmController],
})
export class LlmModule {}
