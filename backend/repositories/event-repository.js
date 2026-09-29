import { db } from '../db.js';

const eventFields = `
    SELECT id, title, poster, event_date AS eventDate, location, description,
        registration_url AS registrationUrl, created_at AS createdAt
    FROM events
`;

export async function list() {
    const [rows] = await db.execute(`${eventFields} ORDER BY event_date ASC`);
    return rows;
}

export async function create(event) {
    await db.execute(`
        INSERT INTO events (id, title, poster, event_date, location, description, registration_url, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [event.id, event.title, event.poster, event.eventDate, event.location, event.description, event.registrationUrl, event.createdBy, event.createdAt]);
    return event;
}

export async function remove(id) {
    const [result] = await db.execute('DELETE FROM events WHERE id = ?', [id]);
    return result;
}
