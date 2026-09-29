import bcrypt from 'bcryptjs';
import { issueToken } from '../middleware/auth.js';
import * as users from '../repositories/user-repository.js';

export function validateRegistration(body) {
    const fullname = String(body.fullname || '').trim();
    const username = String(body.username || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!fullname || username.length < 5 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return null;
    return { fullname, username, email, password };
}

export async function register(input) {
    return users.create({ ...input, passwordHash: bcrypt.hashSync(input.password, 12) });
}

export async function authenticate(identifier, password) {
    const user = await users.findByLogin(identifier);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) return null;
    return { token: issueToken(user), user: { id: user.id, fullname: user.fullname, username: user.username, email: user.email, role: user.role } };
}
