import { reviewRepository } from '../data/review-repository.js';

export async function getReviews(recipeId) {
    const payload = await reviewRepository.getForRecipe(recipeId);
    return payload;
}

export async function addReview(recipeId, rating, comment) {
    const normalizedComment = comment.trim();
    if (!recipeId) throw new Error('Resep yang akan diulas tidak ditemukan.');
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Pilih rating dari 1 sampai 5 bintang.');
    }
    if (!normalizedComment) throw new Error('Tulis komentar sebelum mengirim ulasan.');

    return reviewRepository.add(recipeId, rating, normalizedComment);
}
