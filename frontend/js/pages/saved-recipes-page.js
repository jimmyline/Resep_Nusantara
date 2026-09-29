import { createRecipeCard } from '../ui/recipe-card.js';
import { apiRequest } from '../data/api-client.js';

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('displayUsername').textContent =
        localStorage.getItem('loggedInUsername') || '';
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('active');
    });

    const container = document.getElementById('savedRecipesContainer');
    try {
        const payload = await apiRequest('/recipes/saved/list');
        const savedRecipes = payload.recipes;
        container.replaceChildren();
        if (!savedRecipes.length) {
            container.innerHTML = '<div class="empty-state"><i class="far fa-bookmark"></i><p>Anda belum menyimpan resep apapun</p><a href="afterlogin.html" class="btn-primary">Jelajahi Resep</a></div>';
            return;
        }
        savedRecipes.forEach(saved => {
            const card = createRecipeCard(saved);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Gagal memuat resep tersimpan:', error);
        container.textContent = 'Resep tersimpan tidak dapat dimuat.';
    }
});
