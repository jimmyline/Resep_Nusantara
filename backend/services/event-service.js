import crypto from 'node:crypto';
import * as eventRepository from '../repositories/event-repository.js';

export async function createEvent(body, adminId) {
    const title = String(body.title || '').trim();
    const poster = String(body.poster || '').trim();
    const eventDate = String(body.eventDate || '').trim();
    const location = String(body.location || '').trim();
    const description = String(body.description || '').trim();
    const registrationUrl = String(body.registrationUrl || '').trim();
    if (!title || !poster || !eventDate || !location || !description || !/^https?:\/\//i.test(registrationUrl)) return null;
    return eventRepository.create({ id: crypto.randomUUID(), title, poster, eventDate, location, description, registrationUrl, createdBy: adminId, createdAt: new Date().toISOString() });
}
