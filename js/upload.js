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

    // Preview gambar
    const imageUpload = document.getElementById('imageUpload');
    const recipeImage = document.getElementById('recipeImage');
    const imagePreview = document.getElementById('imagePreview');

    imageUpload.addEventListener('click', () => recipeImage.click());

    recipeImage.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imagePreview.style.display = 'block';
                imageUpload.style.display = 'none';
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Tambah / hapus bahan
    document.getElementById('addIngredientBtn').addEventListener('click', addIngredient);

    function addIngredient() {
        const ingredientsList = document.getElementById('ingredientsList');
        const newIngredient = document.createElement('div');
        newIngredient.className = 'ingredient-item';
        newIngredient.innerHTML = `
            <input type="text" placeholder="Contoh: 1 sdm kecap manis" required>
            <button type="button" class="remove-btn">&times;</button>
        `;
        ingredientsList.appendChild(newIngredient);
        newIngredient.querySelector('.remove-btn').addEventListener('click', () => removeIngredient(newIngredient));
    }

    function removeIngredient(element) {
        const ingredientsList = document.getElementById('ingredientsList');
        if (ingredientsList.children.length > 1) {
            element.remove();
        } else {
            element.querySelector('input').value = '';
        }
    }

    // Tambah / hapus langkah
    document.getElementById('addStepBtn').addEventListener('click', addStep);

    function addStep() {
        const stepsList = document.getElementById('stepsList');
        const newStep = document.createElement('div');
        newStep.className = 'step-item';
        newStep.innerHTML = `
            <textarea placeholder="Tulis langkah pembuatan" rows="2" required></textarea>
            <button type="button" class="remove-btn">&times;</button>
        `;
        stepsList.appendChild(newStep);
        newStep.querySelector('.remove-btn').addEventListener('click', () => removeStep(newStep));
    }

    function removeStep(element) {
        const stepsList = document.getElementById('stepsList');
        if (stepsList.children.length > 1) {
            element.remove();
        } else {
            element.querySelector('textarea').value = '';
        }
    }

    // Submit form
    document.getElementById('recipeUploadForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const recipeTitle = document.getElementById('recipeTitle').value.trim();
        const cookingTime = document.getElementById('cookingTime').value.trim();
        const servings = document.getElementById('servings').value.trim();
        const recipeDescription = document.getElementById('recipeDescription').value.trim();

        const ingredients = [];
        document.querySelectorAll('#ingredientsList input').forEach(input => {
            if (input.value.trim()) ingredients.push(input.value.trim());
        });

        const steps = [];
        document.querySelectorAll('#stepsList textarea').forEach(textarea => {
            if (textarea.value.trim()) steps.push(textarea.value.trim());
        });

        if (!recipeTitle || !cookingTime || !servings || !recipeDescription ||
            ingredients.length === 0 || steps.length === 0 || !recipeImage.files[0]) {
            alert('Harap lengkapi semua field yang diperlukan!');
            return;
        }

        const currentUser = localStorage.getItem('loggedInUsername') || 'Pengguna';

        const recipeData = {
            id: Date.now().toString(),
            title: recipeTitle,
            image: imagePreview.querySelector('img')?.src || '',
            cookingTime: cookingTime,
            servings: servings,
            description: recipeDescription,
            ingredients: ingredients,
            steps: steps,
            isPrivate: document.getElementById('isPrivate').checked,
            createdAt: new Date().toISOString(),
            author: {
                name: currentUser,
                avatar: ''
            }
        };

        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        recipes.push(recipeData);
        localStorage.setItem('recipes', JSON.stringify(recipes));

        alert('Resep telah terbuat. Terima kasih telah berbagi!');
        resetForm();
    });

    function resetForm() {
        document.getElementById('recipeUploadForm').reset();
        imagePreview.style.display = 'none';
        imagePreview.innerHTML = '';
        imageUpload.style.display = 'block';
        recipeImage.value = '';

        const ingredientsList = document.getElementById('ingredientsList');
        while (ingredientsList.children.length > 1) ingredientsList.removeChild(ingredientsList.lastChild);
        ingredientsList.firstElementChild.querySelector('input').value = '';

        const stepsList = document.getElementById('stepsList');
        while (stepsList.children.length > 1) stepsList.removeChild(stepsList.lastChild);
        stepsList.firstElementChild.querySelector('textarea').value = '';
    }

    // Inisialisasi tombol hapus yang sudah ada
    document.querySelectorAll('.ingredients-list .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() { removeIngredient(this.parentElement); });
    });

    document.querySelectorAll('.steps-list .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() { removeStep(this.parentElement); });
    });
});
