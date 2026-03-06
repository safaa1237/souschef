export interface CreateRecipeDto {
  title: string;
  cuisine: string;
  ingredients: string[];
  steps: string[];
  prepTime?: number;
}
