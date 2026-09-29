import { apiRequest } from './api-client.js';

export const reviewRepository = {
    async getForRecipe(recipeId) {
        const payload = await apiRequest(`/recipes/${encodeURIComponent(recipeId)}/reviews`);
        return payload;
    },

    async add(recipeId, rating, comment) {
        return apiRequest(`/recipes/${encodeURIComponent(recipeId)}/reviews`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment })
        });
    }
};
