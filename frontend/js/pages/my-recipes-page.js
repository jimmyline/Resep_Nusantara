import { recipeRepository } from '../data/recipe-repository.js';
import { createRecipeCard } from '../ui/recipe-card.js';
import { getMyRecipes } from '../services/recipe-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('displayUsername').textContent =
        localStorage.getItem('loggedInUsername') || '';
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('active');
    });

    const container = document.getElementById('recipesContainer');
    const render = async () => {
        container.replaceChildren();
        let recipes;
        try {
            recipes = await getMyRecipes();
        } catch (error) {
            console.error('Gagal memuat resep pengguna:', error);
            container.textContent = 'Resep Anda tidak dapat dimuat dari penyimpanan browser.';
            return;
        }
        if (!recipes.length) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-utensils"></i><p>Anda belum memiliki resep</p><a href="upload.html" class="btn-upload">Upload Resep Pertama Anda</a></div>';
            return;
        }
        recipes.forEach(recipe => {
            const card = createRecipeCard(recipe);
            const info = card.querySelector('.recipe-info');
            if (recipe.isPrivate) {
                const visibility = document.createElement('p');
                visibility.textContent = 'Private';
                info.appendChild(visibility);
            }
            const status = document.createElement('p');
            status.textContent = recipe.status === 'approved'
                ? 'Disetujui'
                : recipe.status === 'rejected'
                    ? `Ditolak${recipe.rejectionReason ? `: ${recipe.rejectionReason}` : ''}`
                    : 'Menunggu approval admin';
            info.appendChild(status);
            const actions = document.createElement('div');
            actions.className = 'recipe-actions';
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'btn-delete';
            removeButton.textContent = 'Hapus';
            removeButton.addEventListener('click', async () => {
                if (!confirm(`Hapus resep "${recipe.title}"?`)) return;
                try {
                    await recipeRepository.remove(recipe.id);
                    render();
                } catch (error) {
                    console.error('Gagal menghapus resep:', error);
                    alert('Resep gagal dihapus.');
                }
            });
            actions.appendChild(removeButton);
            card.appendChild(actions);
            container.appendChild(card);
        });
    };
    render();
});
