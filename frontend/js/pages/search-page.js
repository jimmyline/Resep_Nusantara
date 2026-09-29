import { searchPublicRecipes } from '../services/recipe-service.js';
import { createRecipeCard } from '../ui/recipe-card.js';

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('displayUsername').textContent =
        localStorage.getItem('loggedInUsername') || '';
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('active');
    });

    const input = document.querySelector('.search-bar input');
    const container = document.getElementById('searchResultsContainer');
    const params = new URLSearchParams(window.location.search);

    function search(query) {
        const normalized = query.trim();
        if (!normalized) return;
        const url = new URL('search-result.html', window.location.href);
        url.searchParams.set('q', normalized);
        window.location.href = url.toString();
    }
    document.querySelector('.search-bar button')?.addEventListener('click', event => {
        event.preventDefault();
        search(input.value);
    });
    input?.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            search(input.value);
        }
    });

    if (!container) return;
    const query = params.get('q') || '';
    if (input) input.value = query;
    document.getElementById('searchQueryTitle').textContent = `Hasil untuk: "${query}"`;

    try {
        const results = await searchPublicRecipes(query);
        document.getElementById('resultsCount').textContent = `${results.length} resep ditemukan`;
        container.replaceChildren();
        if (!results.length) {
            const empty = document.createElement('div');
            empty.className = 'no-results';
            empty.textContent = `Tidak ada resep publik yang cocok dengan "${query}".`;
            container.appendChild(empty);
            return;
        }
        results.forEach(recipe => container.appendChild(createRecipeCard(recipe)));
    } catch (error) {
        console.error('Gagal mencari resep:', error);
        document.getElementById('resultsCount').textContent = 'Resep tidak dapat dimuat.';
    }
});
