import { db } from '../db.js';

export async function listForRecipe(recipeId) {
    const [reviews] = await db.execute(`
        SELECT reviews.id, reviews.rating, reviews.comment, reviews.created_at AS createdAt, users.username AS author
        FROM reviews JOIN users ON users.id = reviews.user_id
        WHERE reviews.recipe_id = ? ORDER BY reviews.created_at DESC
    `, [recipeId]);
    const average = reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0;
    return { reviews, rating: { average, count: reviews.length } };
}

export async function create({ recipeId, userId, rating, comment }) {
    const [result] = await db.execute('INSERT INTO reviews (recipe_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', [recipeId, userId, rating, comment]);
    return result;
}
