import { apiRequest, getCurrentUsername } from '../data/api-client.js';

const recipeRequests = document.getElementById('recipeRequests');
const eventsList = document.getElementById('eventsList');
const requestCount = document.getElementById('requestCount');
const eventForm = document.getElementById('eventForm');
const eventFormMessage = document.getElementById('eventFormMessage');

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('displayUsername').textContent = getCurrentUsername();
    try {
        const me = await apiRequest('/auth/me');
        if (me.user.role !== 'admin') {
            window.location.href = 'afterlogin.html';
            return;
        }
        await Promise.all([loadRecipeRequests(), loadEvents()]);
    } catch (error) {
        recipeRequests.textContent = error.message;
    }
});

async function loadRecipeRequests() {
    const payload = await apiRequest('/admin/recipes');
    requestCount.textContent = String(payload.recipes.length);
    recipeRequests.replaceChildren();
    if (!payload.recipes.length) {
        recipeRequests.appendChild(createEmptyState('Tidak ada request resep yang menunggu approval.'));
        return;
    }
    payload.recipes.forEach(recipe => recipeRequests.appendChild(createRecipeRequest(recipe)));
}

function createRecipeRequest(recipe) {
    const item = document.createElement('article');
    item.className = 'admin-item';
    const image = document.createElement('img');
    image.src = recipe.image;
    image.alt = recipe.title;
    const content = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = recipe.title;
    const detail = document.createElement('p');
    detail.textContent = `Oleh ${recipe.author?.name || 'Pengguna'} | ${recipe.cookingTime} menit | ${recipe.servings} porsi`;
    const description = document.createElement('p');
    description.textContent = recipe.description;
    content.append(title, detail, description);

    const actions = document.createElement('div');
    actions.className = 'admin-actions';
    const approve = document.createElement('button');
    approve.className = 'admin-button';
    approve.type = 'button';
    approve.innerHTML = '<i class="fas fa-check"></i> Setujui';
    approve.addEventListener('click', () => moderateRecipe(recipe.id, 'approved'));
    const reject = document.createElement('button');
    reject.className = 'admin-button-danger';
    reject.type = 'button';
    reject.innerHTML = '<i class="fas fa-times"></i> Tolak';
    reject.addEventListener('click', () => {
        const reason = window.prompt('Masukkan alasan penolakan:');
        if (reason?.trim()) moderateRecipe(recipe.id, 'rejected', reason.trim());
    });
    actions.append(approve, reject);
    item.append(image, content, actions);
    return item;
}

async function moderateRecipe(id, status, rejectionReason = '') {
    try {
        await apiRequest(`/admin/recipes/${encodeURIComponent(id)}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, rejectionReason })
        });
        await loadRecipeRequests();
    } catch (error) {
        window.alert(error.message);
    }
}

async function loadEvents() {
    const payload = await apiRequest('/admin/events');
    eventsList.replaceChildren();
    if (!payload.events.length) {
        eventsList.appendChild(createEmptyState('Belum ada event yang dipublikasikan.'));
        return;
    }
    payload.events.forEach(event => eventsList.appendChild(createEventItem(event)));
}

function createEventItem(event) {
    const item = document.createElement('article');
    item.className = 'admin-item';
    const image = document.createElement('img');
    image.src = event.poster;
    image.alt = event.title;
    const content = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = event.title;
    const detail = document.createElement('p');
    detail.textContent = `${new Date(event.eventDate).toLocaleString('id-ID')} | ${event.location}`;
    const description = document.createElement('p');
    description.textContent = event.description;
    content.append(title, detail, description);
    const actions = document.createElement('div');
    actions.className = 'admin-actions';
    const registration = document.createElement('a');
    registration.className = 'admin-button-secondary';
    registration.href = event.registrationUrl;
    registration.target = '_blank';
    registration.rel = 'noopener noreferrer';
    registration.textContent = 'Buka link';
    const remove = document.createElement('button');
    remove.className = 'admin-button-danger';
    remove.type = 'button';
    remove.textContent = 'Hapus';
    remove.addEventListener('click', () => removeEvent(event.id));
    actions.append(registration, remove);
    item.append(image, content, actions);
    return item;
}

async function removeEvent(id) {
    if (!window.confirm('Hapus event ini?')) return;
    try {
        await apiRequest(`/admin/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
        await loadEvents();
    } catch (error) {
        window.alert(error.message);
    }
}

eventForm.addEventListener('submit', async event => {
    event.preventDefault();
    eventFormMessage.textContent = '';
    const posterFile = document.getElementById('eventPoster').files?.[0];
    if (!posterFile || !posterFile.type.startsWith('image/')) {
        eventFormMessage.textContent = 'Pilih file poster berupa gambar.';
        return;
    }
    if (posterFile.size > 5 * 1024 * 1024) {
        eventFormMessage.textContent = 'Ukuran poster maksimal 5MB.';
        return;
    }
    try {
        const poster = await readFile(posterFile);
        await apiRequest('/admin/events', {
            method: 'POST',
            body: JSON.stringify({
                title: document.getElementById('eventTitle').value.trim(),
                poster,
                eventDate: new Date(document.getElementById('eventDate').value).toISOString(),
                location: document.getElementById('eventLocation').value.trim(),
                description: document.getElementById('eventDescription').value.trim(),
                registrationUrl: document.getElementById('registrationUrl').value.trim()
            })
        });
        eventForm.reset();
        eventFormMessage.textContent = 'Event berhasil dipublikasikan.';
        await loadEvents();
    } catch (error) {
        eventFormMessage.textContent = error.message;
    }
});

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(String(reader.result)));
        reader.addEventListener('error', () => reject(new Error('Poster gagal dibaca.')));
        reader.readAsDataURL(file);
    });
}

function createEmptyState(message) {
    const empty = document.createElement('p');
    empty.className = 'empty-admin-state';
    empty.textContent = message;
    return empty;
}
