export function getRecipeUrl(recipe) {
    return `recipe.html?id=${encodeURIComponent(recipe.id)}`;
}

export function createRecipeCard(recipe) {
    const card = document.createElement('article');
    card.className = 'recipe-card';

    const link = document.createElement('a');
    link.href = getRecipeUrl(recipe);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'recipe-img';

    const image = document.createElement('img');
    image.src = recipe.image;
    image.alt = recipe.title;
    imageContainer.appendChild(image);

    const info = document.createElement('div');
    info.className = 'recipe-info';

    const title = document.createElement('h3');
    title.className = 'recipe-title';
    title.textContent = recipe.title;

    const meta = document.createElement('div');
    meta.className = 'recipe-meta';
    meta.textContent = `${recipe.cookingTime} menit · ${recipe.servings} porsi`;

    const rating = document.createElement('div');
    rating.className = 'recipe-rating';
    rating.textContent = recipe.ratingCount
        ? `★ ${Number(recipe.rating).toFixed(1)} (${recipe.ratingCount} ulasan)`
        : 'Belum ada ulasan';

    const author = document.createElement('div');
    author.className = 'recipe-author';
    author.textContent = recipe.author?.name || 'Pengguna';

    info.append(title, meta, rating, author);
    link.append(imageContainer, info);
    card.appendChild(link);
    return card;
}
