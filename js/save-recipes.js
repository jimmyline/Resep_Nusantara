document.addEventListener('DOMContentLoaded', function() {
    // Tampilkan username
    const username = localStorage.getItem('loggedInUsername');
    const displayUsername = document.getElementById('displayUsername');
    if (displayUsername) displayUsername.textContent = username || '';

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    const savedRecipesContainer = document.getElementById('savedRecipesContainer');
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

    if (savedRecipes.length === 0) {
        savedRecipesContainer.innerHTML = `
            <div class="empty-state">
                <i class="far fa-bookmark"></i>
                <p>Anda belum menyimpan resep apapun</p>
                <a href="afterlogin.html" class="btn-primary">Jelajahi Resep</a>
            </div>
        `;
        return;
    }

    savedRecipesContainer.innerHTML = '';

    savedRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <a href="${recipe.id}.html">
                <div class="recipe-img">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span><i class="far fa-clock"></i> ${recipe.time} menit</span>
                        <span><i class="fas fa-utensils"></i> ${recipe.servings} porsi</span>
                    </div>
                    <div class="recipe-author">
                        <span class="author-name">${recipe.author}</span>
                    </div>
                </div>
            </a>
        `;
        savedRecipesContainer.appendChild(recipeCard);
    });
});
