import { db, serializeRecipe } from '../db.js';

const recipeQuery = `
    SELECT recipes.id, recipes.title, recipes.image, recipes.cooking_time AS cookingTime,
        recipes.servings, recipes.description, recipes.ingredients, recipes.steps,
        recipes.is_private AS isPrivate, recipes.status, recipes.rejection_reason AS rejectionReason,
        recipes.created_at AS createdAt, users.username AS authorName,
        COALESCE((SELECT AVG(rating) FROM reviews WHERE reviews.recipe_id = recipes.id), 0) AS ratingAverage,
        (SELECT COUNT(*) FROM reviews WHERE reviews.recipe_id = recipes.id) AS ratingCount
    FROM recipes JOIN users ON users.id = recipes.user_id
`;

export async function listForUser(userId) {
    const [rows] = await db.execute(`${recipeQuery} JOIN saved_recipes ON saved_recipes.recipe_id = recipes.id WHERE saved_recipes.user_id = ? ORDER BY saved_recipes.created_at DESC`, [userId]);
    return rows.map(serializeRecipe);
}

export async function add(userId, recipeId) {
    const [result] = await db.execute('INSERT INTO saved_recipes (user_id, recipe_id) VALUES (?, ?)', [userId, recipeId]);
    return result;
}

export async function remove(userId, recipeId) {
    const [result] = await db.execute('DELETE FROM saved_recipes WHERE user_id = ? AND recipe_id = ?', [userId, recipeId]);
    return result;
}
