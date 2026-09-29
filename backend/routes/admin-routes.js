import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import * as recipes from '../repositories/recipe-repository.js';
import * as events from '../repositories/event-repository.js';
import * as eventService from '../services/event-service.js';

const router = Router();
router.use(requireAuth, requireAdmin);

router.get('/recipes', async (_request, response) => {
    response.json({ recipes: await recipes.listPending() });
});

router.patch('/recipes/:id/status', async (request, response) => {
    const status = String(request.body.status || '').trim();
    const rejectionReason = String(request.body.rejectionReason || '').trim();
    if (!['approved', 'rejected'].includes(status)) return response.status(400).json({ message: 'Status moderasi tidak valid.' });
    if (status === 'rejected' && !rejectionReason) return response.status(400).json({ message: 'Alasan penolakan wajib diisi.' });
    const result = await recipes.updateStatus(request.params.id, status, status === 'rejected' ? rejectionReason : null);
    if (!result.changes) return response.status(404).json({ message: 'Request resep tidak ditemukan.' });
    response.json({ message: status === 'approved' ? 'Resep disetujui.' : 'Resep ditolak.' });
});

router.get('/events', async (_request, response) => {
    response.json({ events: await events.list() });
});

router.post('/events', async (request, response) => {
    const event = await eventService.createEvent(request.body, request.user.id);
    if (!event) return response.status(400).json({ message: 'Data event tidak lengkap atau link pendaftaran tidak valid.' });
    response.status(201).json({ event });
});

router.delete('/events/:id', async (request, response) => {
    const result = await events.remove(request.params.id);
    if (!result.changes) return response.status(404).json({ message: 'Event tidak ditemukan.' });
    response.status(204).end();
});

export default router;
