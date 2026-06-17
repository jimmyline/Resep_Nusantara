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

    // Interaksi bintang rating
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            stars.forEach((s, index) => {
                if (index < value) {
                    s.innerHTML = '<i class="fas fa-star"></i>';
                    s.classList.add('active');
                } else {
                    s.innerHTML = '<i class="far fa-star"></i>';
                    s.classList.remove('active');
                }
            });
        });
    });

    // Simpan resep
    const saveRecipeBtn = document.getElementById('saveRecipeBtn');
    if (!saveRecipeBtn) return;

    const recipeTitleEl = document.getElementById('recipeTitle');
    const recipeImageEl = document.getElementById('recipeImage');
    const recipeId = window.location.pathname.split('/').pop().replace('.html', '');

    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const isSaved = savedRecipes.some(recipe => recipe.id === recipeId);

    if (isSaved) {
        saveRecipeBtn.innerHTML = '<i class="fas fa-bookmark"></i> Disimpan';
        saveRecipeBtn.classList.add('saved');
    }

    saveRecipeBtn.addEventListener('click', function() {
        const saved = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        const recipeIndex = saved.findIndex(recipe => recipe.id === recipeId);

        if (recipeIndex === -1) {
            saved.push({
                id: recipeId,
                title: recipeTitleEl ? recipeTitleEl.textContent : '',
                image: recipeImageEl ? recipeImageEl.src : '',
                author: document.getElementById('authorName') ? document.getElementById('authorName').textContent : '',
                time: document.getElementById('cookingTime') ? document.getElementById('cookingTime').textContent : '',
                servings: document.getElementById('servings') ? document.getElementById('servings').textContent : '',
                savedAt: new Date().toISOString()
            });
            saveRecipeBtn.innerHTML = '<i class="fas fa-bookmark"></i> Disimpan';
            saveRecipeBtn.classList.add('saved');
        } else {
            saved.splice(recipeIndex, 1);
            saveRecipeBtn.innerHTML = '<i class="far fa-bookmark"></i> Simpan';
            saveRecipeBtn.classList.remove('saved');
        }

        localStorage.setItem('savedRecipes', JSON.stringify(saved));
    });
});
