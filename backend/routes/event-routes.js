import { Router } from 'express';
import * as events from '../repositories/event-repository.js';

const router = Router();

router.get('/', async (_request, response) => {
    response.json({ events: await events.list() });
});

export default router;
