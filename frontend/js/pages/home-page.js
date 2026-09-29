import { getPublicRecipes } from '../services/recipe-service.js';
import { apiRequest } from '../data/api-client.js';
import { createRecipeCard } from '../ui/recipe-card.js';

document.addEventListener('DOMContentLoaded', async () => {
    const displayUsername = document.getElementById('displayUsername');
    if (displayUsername) {
        displayUsername.textContent = localStorage.getItem('loggedInUsername') || '';
    }

    const container = document.querySelector('.popular-recipes .recipe-grid');
    const categoryContainer = document.querySelector('.category-grid');
    if (!container || !categoryContainer) return;

    try {
        const [recipesPayload, eventsPayload] = await Promise.all([
            getPublicRecipes(),
            apiRequest('/events')
        ]);
        const recipes = recipesPayload;
        container.replaceChildren();
        categoryContainer.replaceChildren();
        recipes.slice(0, 4).forEach(recipe => categoryContainer.appendChild(createCategoryCard(recipe)));
        recipes.forEach(recipe => container.appendChild(createRecipeCard(recipe)));
        renderEvents(eventsPayload.events);
    } catch (error) {
        console.error('Gagal memuat resep komunitas:', error);
    }
});

function renderEvents(events) {
    const container = document.querySelector('.events-list');
    if (!container) return;
    container.replaceChildren();
    if (!events.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-events';
        empty.textContent = 'Belum ada event yang dipublikasikan.';
        container.appendChild(empty);
        return;
    }
    events.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';
        const image = document.createElement('img');
        image.src = event.poster;
        image.alt = event.title;
        const content = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = event.title;
        const date = document.createElement('p');
        date.textContent = new Date(event.eventDate).toLocaleString('id-ID');
        const location = document.createElement('p');
        location.textContent = event.location;
        const description = document.createElement('p');
        description.textContent = event.description;
        const link = document.createElement('a');
        link.href = event.registrationUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Daftar event';
        content.append(title, date, location, description, link);
        card.append(image, content);
        container.appendChild(card);
    });
}

function createCategoryCard(recipe) {
    const link = document.createElement('a');
    link.className = 'category-card';
    link.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;

    const image = document.createElement('img');
    image.src = recipe.image;
    image.alt = recipe.title;

    const title = document.createElement('h3');
    title.textContent = recipe.title;
    link.append(image, title);
    return link;
}
