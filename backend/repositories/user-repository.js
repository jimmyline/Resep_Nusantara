import { db } from '../db.js';

export async function findByLogin(identifier) {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier]);
    return rows[0];
}

export async function findPublicById(id) {
    const [rows] = await db.execute('SELECT id, fullname, username, email, role FROM users WHERE id = ?', [id]);
    return rows[0];
}

export async function create({ fullname, username, email, passwordHash }) {
    const [result] = await db.execute(`
        INSERT INTO users (fullname, username, email, password_hash)
        VALUES (?, ?, ?, ?)
    `, [fullname, username, email, passwordHash]);
    return result;
}
