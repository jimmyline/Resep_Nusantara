import { recipeRepository } from '../data/recipe-repository.js';
import { apiRequest } from '../data/api-client.js';

export function getPublicRecipes() {
    return recipeRepository.getAll();
}

export function getMyRecipes() {
    return recipeRepository.getMine();
}

export function getRecipe(id) {
    return recipeRepository.getById(id);
}

export function searchPublicRecipes(query) {
    const normalizedQuery = query.trim().toLocaleLowerCase('id');
    if (!normalizedQuery) return [];
    return apiRequest(`/recipes?q=${encodeURIComponent(normalizedQuery)}`).then(payload => payload.recipes);
}
