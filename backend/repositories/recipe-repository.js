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

export async function listPublic(query = '') {
    const pattern = `%${query}%`;
    const [rows] = query
        ? await db.execute(`${recipeQuery} WHERE recipes.status = 'approved' AND recipes.is_private = 0 AND (recipes.title LIKE ? OR recipes.description LIKE ?) ORDER BY recipes.created_at DESC`, [pattern, pattern])
        : await db.execute(`${recipeQuery} WHERE recipes.status = 'approved' AND recipes.is_private = 0 ORDER BY recipes.created_at DESC`);
    return rows.map(serializeRecipe);
}

export async function listMine(userId) {
    const [rows] = await db.execute(`${recipeQuery} WHERE recipes.user_id = ? ORDER BY recipes.created_at DESC`, [userId]);
    return rows.map(serializeRecipe);
}

export async function findPublicById(id) {
    const [rows] = await db.execute(`${recipeQuery} WHERE recipes.id = ? AND recipes.status = 'approved' AND recipes.is_private = 0`, [id]);
    const row = rows[0];
    return serializeRecipe(row);
}

export async function create(recipe) {
    await db.execute(`
        INSERT INTO recipes (id, user_id, title, image, cooking_time, servings, description, ingredients, steps, is_private, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [recipe.id, recipe.userId, recipe.title, recipe.image, recipe.cookingTime, recipe.servings, recipe.description, recipe.ingredients, recipe.steps, recipe.isPrivate, recipe.status, recipe.createdAt]);
}

export async function deleteOwned(id, userId) {
    const [result] = await db.execute('DELETE FROM recipes WHERE id = ? AND user_id = ?', [id, userId]);
    return result;
}

export async function listPending() {
    const [rows] = await db.execute(`${recipeQuery} WHERE recipes.status = 'pending' ORDER BY recipes.created_at ASC`);
    return rows.map(serializeRecipe);
}

export async function updateStatus(id, status, rejectionReason) {
    const [result] = await db.execute(`
        UPDATE recipes SET status = ?, rejection_reason = ?
        WHERE id = ? AND status = 'pending'
    `, [status, rejectionReason, id]);
    return result;
}
