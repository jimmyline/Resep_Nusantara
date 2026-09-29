import crypto from 'node:crypto';
import * as recipes from '../repositories/recipe-repository.js';

export function validateRecipeInput(body) {
    const title = String(body.title || '').trim();
    const image = String(body.image || '').trim();
    const description = String(body.description || '').trim();
    const cookingTime = Number(body.cookingTime);
    const servings = Number(body.servings);
    if (!title || !image || !description || !Number.isFinite(cookingTime) || cookingTime <= 0 || !Number.isInteger(servings) || servings <= 0 || !Array.isArray(body.ingredients) || !body.ingredients.length || !Array.isArray(body.steps) || !body.steps.length) return null;
    return { title, image, description, cookingTime, servings, ingredients: body.ingredients.map(String), steps: body.steps.map(String), isPrivate: Boolean(body.isPrivate) };
}

export async function createRecipe(body, userId) {
    const input = validateRecipeInput(body);
    if (!input) return null;
    const recipe = {
        id: crypto.randomUUID(),
        userId,
        ...input,
        ingredients: JSON.stringify(input.ingredients),
        steps: JSON.stringify(input.steps),
        isPrivate: input.isPrivate ? 1 : 0,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    await recipes.create(recipe);
    return { ...recipe, isPrivate: Boolean(recipe.isPrivate), ingredients: input.ingredients, steps: input.steps };
}
