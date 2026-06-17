document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    function searchRecipes(query) {
        query = query.toLowerCase().trim();
        if (!query) return;

        const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

        const results = allRecipes.filter(recipe => {
            return (
                recipe.title.toLowerCase().includes(query) ||
                (recipe.description && recipe.description.toLowerCase().includes(query)) ||
                (recipe.ingredients && recipe.ingredients.some(ing => ing.toLowerCase().includes(query))) ||
                (recipe.steps && recipe.steps.some(step => step.toLowerCase().includes(query)))
            );
        });

        localStorage.setItem('searchResults', JSON.stringify(results));
        localStorage.setItem('searchQuery', query);

        window.location.href = 'search-result.html?q=' + encodeURIComponent(query);
    }

    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            searchRecipes(searchInput.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchRecipes(searchInput.value);
            }
        });
    }

    // Tampilkan hasil di halaman search-result.html
    if (window.location.pathname.includes('search-result')) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q') || localStorage.getItem('searchQuery') || '';
        const results = JSON.parse(localStorage.getItem('searchResults')) || [];

        const titleEl = document.getElementById('searchQueryTitle');
        const countEl = document.getElementById('resultsCount');
        const container = document.getElementById('searchResultsContainer');

        if (titleEl) titleEl.textContent = `Hasil untuk: "${query}"`;
        if (countEl) countEl.textContent = `${results.length} resep ditemukan`;

        if (container) {
            if (results.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>Tidak ada resep yang cocok dengan "${query}"</p>
                    </div>
                `;
            } else {
                container.innerHTML = '';
                results.forEach(recipe => {
                    const card = document.createElement('div');
                    card.className = 'recipe-card';
                    card.innerHTML = `
                        <div class="recipe-img">
                            <img src="${recipe.image}" alt="${recipe.title}">
                        </div>
                        <div class="recipe-info">
                            <h3 class="recipe-title">${recipe.title}</h3>
                            <div class="recipe-meta">
                                <span><i class="far fa-clock"></i> ${recipe.cookingTime} menit</span>
                                <span><i class="fas fa-utensils"></i> ${recipe.servings} porsi</span>
                            </div>
                            <div class="recipe-author">
                                <span class="author-name">${recipe.author ? recipe.author.name : ''}</span>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }
        }
    }
});
