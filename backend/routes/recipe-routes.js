import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as recipes from '../repositories/recipe-repository.js';
import * as reviews from '../repositories/review-repository.js';
import * as savedRecipes from '../repositories/saved-recipe-repository.js';
import * as recipeService from '../services/recipe-service.js';
import * as reviewService from '../services/review-service.js';

const router = Router();

router.get('/', async (request, response) => {
    response.json({ recipes: await recipes.listPublic(String(request.query.q || '').trim()) });
});

router.get('/mine', requireAuth, async (request, response) => {
    response.json({ recipes: await recipes.listMine(request.user.id) });
});

router.get('/:id', async (request, response) => {
    const recipe = await recipes.findPublicById(request.params.id);
    if (!recipe) return response.status(404).json({ message: 'Resep tidak ditemukan.' });
    response.json({ recipe });
});

router.post('/', requireAuth, async (request, response) => {
    const recipe = await recipeService.createRecipe(request.body, request.user.id);
    if (!recipe) return response.status(400).json({ message: 'Data resep tidak lengkap atau tidak valid.' });
    response.status(201).json({ recipe: { ...recipe, author: { name: request.user.username } } });
});

router.delete('/:id', requireAuth, async (request, response) => {
    const result = await recipes.deleteOwned(request.params.id, request.user.id);
    if (!result.changes) return response.status(404).json({ message: 'Resep tidak ditemukan atau bukan milik Anda.' });
    response.status(204).end();
});

router.get('/:id/reviews', async (request, response) => {
    response.json(await reviews.listForRecipe(request.params.id));
});

router.post('/:id/reviews', requireAuth, async (request, response) => {
    const review = await reviewService.addReview(request.params.id, request.user.id, request.body);
    if (!review) return response.status(400).json({ message: 'Rating dan komentar wajib diisi.' });
    response.status(201).json({ id: review.lastInsertRowid, rating: Number(request.body.rating), comment: String(request.body.comment).trim() });
});

router.get('/saved/list', requireAuth, async (request, response) => {
    response.json({ recipes: await savedRecipes.listForUser(request.user.id) });
});

router.post('/saved/:id', requireAuth, async (request, response) => {
    try {
        await savedRecipes.add(request.user.id, request.params.id);
        response.status(201).json({ message: 'Resep disimpan.' });
    } catch {
        response.status(409).json({ message: 'Resep sudah tersimpan atau tidak ditemukan.' });
    }
});

router.delete('/saved/:id', requireAuth, async (request, response) => {
    await savedRecipes.remove(request.user.id, request.params.id);
    response.status(204).end();
});

export default router;
