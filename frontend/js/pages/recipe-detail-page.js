import { apiRequest } from '../data/api-client.js';
import { getRecipe } from '../services/recipe-service.js';
import { addReview, getReviews } from '../services/review-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('loggedInUsername') || '';
    const displayUsername = document.getElementById('displayUsername');
    if (displayUsername) displayUsername.textContent = username;
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('active');
    });

    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id') ||
        document.querySelector('.recipe-detail')?.dataset.recipeId ||
        window.location.pathname.split('/').pop().replace('.html', '');
    if (params.has('id')) {
        try {
            const recipe = await getRecipe(recipeId);
            renderRecipe(recipe);
        } catch {
            alert('Resep tidak ditemukan atau bersifat private.');
            window.location.href = 'afterlogin.html';
            return;
        }
    }

    function renderRecipe(data) {
        document.title = `${data.title} - Resep Nusantara`;
        document.getElementById('recipeTitle').textContent = data.title;
        document.getElementById('recipeImage').src = data.image;
        document.getElementById('recipeImage').alt = data.title;
        document.getElementById('authorName').textContent = data.author?.name || 'Pengguna';
        document.getElementById('uploadDate').textContent = data.createdAt
            ? new Date(data.createdAt).toLocaleDateString('id-ID')
            : '';
        document.getElementById('cookingTime').textContent = data.cookingTime;
        document.getElementById('servings').textContent = data.servings;
        document.getElementById('recipeDescription').textContent = data.description || '';
        replaceList('ingredientsList', data.ingredients);
        replaceList('stepsList', data.steps);
    }

    function replaceList(id, items) {
        const list = document.getElementById(id);
        list.replaceChildren(...(items || []).map(text => {
            const item = document.createElement('li');
            item.textContent = text;
            return item;
        }));
    }

    const stars = [...document.querySelectorAll('.star')];
    let selectedRating = 0;
    function updateStars(rating) {
        stars.forEach((star, index) => {
            const active = index < rating;
            star.classList.toggle('active', active);
            star.innerHTML = active
                ? '<i class="fas fa-star"></i>'
                : '<i class="far fa-star"></i>';
            star.setAttribute('aria-pressed', String(active));
        });
    }
    stars.forEach(star => {
        star.setAttribute('role', 'button');
        star.setAttribute('tabindex', '0');
        const select = () => {
            selectedRating = Number(star.dataset.value);
            updateStars(selectedRating);
        };
        star.addEventListener('click', select);
        star.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                select();
            }
        });
    });

    const reviewsContainer = document.getElementById('reviewsContainer');
    async function renderReviews() {
        const { reviews, rating: ratingSummary } = await getReviews(recipeId);
        reviewsContainer.replaceChildren();
        if (!reviews.length) {
            const empty = document.createElement('p');
            empty.className = 'empty-reviews';
            empty.textContent = 'Belum ada ulasan. Jadilah yang pertama berbagi pengalaman!';
            reviewsContainer.appendChild(empty);
        } else {
            reviews.forEach(review => {
                const card = document.createElement('article');
                card.className = 'review-card';
                const header = document.createElement('div');
                header.className = 'review-header';
                const author = document.createElement('span');
                author.className = 'review-author';
                author.textContent = review.author;
                const rating = document.createElement('span');
                rating.className = 'review-rating';
                rating.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`;
                const date = document.createElement('time');
                date.className = 'review-date';
                date.dateTime = review.createdAt;
                date.textContent = new Date(review.createdAt).toLocaleDateString('id-ID');
                const comment = document.createElement('p');
                comment.className = 'review-content';
                comment.textContent = review.comment;
                header.append(author, rating, date);
                card.append(header, comment);
                reviewsContainer.appendChild(card);
            });
        }

        const { average, count } = ratingSummary;
        let summary = document.getElementById('ratingSummary');
        if (!summary) {
            summary = document.createElement('p');
            summary.id = 'ratingSummary';
            summary.className = 'recipe-rating-summary';
            document.querySelector('.recipe-meta').appendChild(summary);
        }
        summary.textContent = count
            ? `★ ${average.toFixed(1)} dari ${count} ulasan`
            : 'Belum ada rating';
    }
    renderReviews().catch(error => console.error('Gagal memuat ulasan:', error));

    document.getElementById('submitReviewBtn')?.addEventListener('click', async () => {
        try {
            await addReview(recipeId, selectedRating, document.getElementById('reviewText').value);
            document.getElementById('reviewText').value = '';
            selectedRating = 0;
            updateStars(0);
            await renderReviews();
        } catch (error) {
            alert(error.message);
        }
    });

    const saveButton = document.getElementById('saveRecipeBtn');
    if (!saveButton) return;
    async function updateSaveButton() {
        const { recipes } = await apiRequest('/recipes/saved/list');
        const isSaved = recipes.some(item => item.id === recipeId);
        saveButton.innerHTML = isSaved
            ? '<i class="fas fa-bookmark"></i> Disimpan'
            : '<i class="far fa-bookmark"></i> Simpan';
        saveButton.classList.toggle('saved', isSaved);
    }
    updateSaveButton().catch(error => console.error('Gagal memuat bookmark:', error));
    saveButton.addEventListener('click', async () => {
        try {
            const { recipes } = await apiRequest('/recipes/saved/list');
            const isSaved = recipes.some(item => item.id === recipeId);
            await apiRequest(`/recipes/saved/${encodeURIComponent(recipeId)}`, {
                method: isSaved ? 'DELETE' : 'POST'
            });
            await updateSaveButton();
        } catch (error) {
            alert(error.message);
        }
    });
});
