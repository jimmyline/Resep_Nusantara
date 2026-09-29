import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as users from '../repositories/user-repository.js';
import * as authService from '../services/auth-service.js';

const router = Router();

router.post('/register', async (request, response) => {
    const input = authService.validateRegistration(request.body);
    if (!input) return response.status(400).json({ message: 'Data pendaftaran tidak valid.' });
    try {
        const result = await authService.register(input);
        response.status(201).json({ message: 'Pendaftaran berhasil.', user: { id: result.lastInsertRowid, username: input.username } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return response.status(409).json({ message: 'Username atau email sudah digunakan.' });
        response.status(500).json({ message: 'Pendaftaran gagal.' });
    }
});

router.post('/login', async (request, response) => {
    const identifier = String(request.body.username || '').trim();
    const password = String(request.body.password || '');
    const session = await authService.authenticate(identifier, password);
    if (!session) return response.status(401).json({ message: 'Username atau password salah.' });
    response.json(session);
});

router.get('/me', requireAuth, async (request, response) => {
    const user = await users.findPublicById(request.user.id);
    if (!user) return response.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    response.json({ user });
});

export default router;
