import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'development-only-secret';

export function issueToken(user) {
    return jwt.sign({ id: user.id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '7d' });
}

export function requireAuth(request, response, next) {
    const authorization = request.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return response.status(401).json({ message: 'Autentikasi diperlukan.' });

    try {
        request.user = jwt.verify(token, jwtSecret);
        next();
    } catch {
        response.status(401).json({ message: 'Sesi tidak valid atau sudah kedaluwarsa.' });
    }
}

export function requireAdmin(request, response, next) {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: 'Akses admin diperlukan.' });
    }
    next();
}
