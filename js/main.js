document.addEventListener('DOMContentLoaded', function() {
    // Tampilkan username dari localStorage
    const username = localStorage.getItem('loggedInUsername');
    const displayUsername = document.getElementById('displayUsername');
    if (displayUsername) {
        displayUsername.textContent = username || '';
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Muat resep populer ke homepage
    loadRecipes('.popular-recipes .recipe-grid', [
        {
            id: 1,
            title: 'Gudeg',
            image: 'images/gudeg.jpg',
            time: 50,
            servings: 2,
            rating: 4.9,
            author: 'Fransesca',
            authorImage: 'images/woman.jpg'
        },
        {
            id: 2,
            title: 'Mie Celor',
            image: 'images/miecelor.jpg',
            time: 90,
            servings: 4,
            rating: 4.8,
            author: 'Mikasa',
            authorImage: 'images/woman2.jpg'
        },
        {
            id: 3,
            title: 'Tahu Sumedang',
            image: 'images/tahu sumedang.jpg',
            time: 30,
            servings: 4,
            rating: 4.5,
            author: 'Budianto',
            authorImage: 'images/man.jpg'
        }
    ]);

    // Carousel
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (!carouselInner || items.length === 0) return;

    let currentIndex = 0;
    let intervalId;
    const slideInterval = 5000;

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        items.forEach((item, index) => item.classList.toggle('active', index === currentIndex));
        indicators.forEach((indicator, index) => indicator.classList.toggle('active', index === currentIndex));
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }

    function startAutoSlide() {
        intervalId = setInterval(nextSlide, slideInterval);
    }

    function resetAutoSlide() {
        clearInterval(intervalId);
        startAutoSlide();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            resetAutoSlide();
        });
    });

    startAutoSlide();

    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
        carousel.addEventListener('mouseleave', () => startAutoSlide());

        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(intervalId);
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) nextSlide();
            else if (touchEndX > touchStartX + 50) prevSlide();
            startAutoSlide();
        }, { passive: true });
    }
});

function loadRecipes(containerSelector, recipes) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <a href="recipe-detail.html?id=${recipe.id}">
                <div class="recipe-img">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span><i class="far fa-clock"></i> ${recipe.time} menit</span>
                        <span><i class="fas fa-utensils"></i> ${recipe.servings} porsi</span>
                    </div>
                    <div class="recipe-rating">
                        ${generateRatingStars(recipe.rating)}
                        <span>${recipe.rating}</span>
                    </div>
                    <div class="recipe-author">
                        <img src="${recipe.authorImage}" alt="${recipe.author}" class="author-avatar">
                        <span class="author-name">${recipe.author}</span>
                    </div>
                </div>
            </a>
        `;
        container.appendChild(recipeCard);
    });
}

function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return stars;
}
