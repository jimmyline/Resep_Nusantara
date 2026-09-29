import * as reviews from '../repositories/review-repository.js';

export async function addReview(recipeId, userId, body) {
    const rating = Number(body.rating);
    const comment = String(body.comment || '').trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) return null;
    return reviews.create({ recipeId, userId, rating, comment });
}
