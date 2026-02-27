import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service.js';
import { RecipeController } from './recipe.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './recipe.schema.js';
import { User, UserSchema } from '../users/user.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class RecipeModule {}
