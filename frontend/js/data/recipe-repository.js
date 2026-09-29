import { apiRequest } from './api-client.js';

export const recipeRepository = {
    async getAll() {
        const payload = await apiRequest('/recipes');
        return payload.recipes;
    },

    async getMine() {
        const payload = await apiRequest('/recipes/mine');
        return payload.recipes;
    },

    async getById(id) {
        const payload = await apiRequest(`/recipes/${encodeURIComponent(id)}`);
        return payload.recipe;
    },

    async save(recipe) {
        const payload = await apiRequest('/recipes', { method: 'POST', body: JSON.stringify(recipe) });
        return payload.recipe;
    },

    async remove(id) {
        await apiRequest(`/recipes/${encodeURIComponent(id)}`, { method: 'DELETE' });
    }
};
