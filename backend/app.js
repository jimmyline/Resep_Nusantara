import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { initializeDatabase } from './db.js';
import authRoutes from './routes/auth-routes.js';
import recipeRoutes from './routes/recipe-routes.js';
import adminRoutes from './routes/admin-routes.js';
import eventRoutes from './routes/event-routes.js';
import healthRoutes from './routes/health-routes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(backendDirectory, '..', 'frontend');

app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use(express.static(frontendDirectory));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);

app.use((request, response, next) => {
    if (request.path.startsWith('/api/')) return next();
    if (request.path.endsWith('.html')) return response.status(404).send('Halaman tidak ditemukan.');
    response.sendFile(path.join(frontendDirectory, 'afterlogin.html'));
});

await initializeDatabase();

app.listen(port, () => {
    console.log(`Resep Nusantara berjalan di http://localhost:${port}`);
});
