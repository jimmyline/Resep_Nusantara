import { recipeRepository } from '../data/recipe-repository.js';
import { getCurrentUsername } from '../data/api-client.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recipeUploadForm');
    const imageUpload = document.getElementById('imageUpload');
    const imageInput = document.getElementById('recipeImage');
    const imagePreview = document.getElementById('imagePreview');
    const ingredientsList = document.getElementById('ingredientsList');
    const stepsList = document.getElementById('stepsList');

    document.getElementById('displayUsername').textContent =
        localStorage.getItem('loggedInUsername') || '';
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('active');
    });

    imageUpload.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', () => {
        const file = imageInput.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Pilih file gambar dengan format yang didukung.');
            imageInput.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran foto maksimal 5MB.');
            imageInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const image = document.createElement('img');
            image.src = String(reader.result);
            image.alt = 'Preview resep';
            imagePreview.replaceChildren(image);
            imagePreview.style.display = 'block';
            imageUpload.style.display = 'none';
        });
        reader.addEventListener('error', () => alert('Foto gagal dibaca. Silakan pilih ulang.'));
        reader.readAsDataURL(file);
    });

    document.getElementById('addIngredientBtn').addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'ingredient-item';
        row.innerHTML = '<input type="text" placeholder="Contoh: 1 sdm kecap manis" required><button type="button" class="remove-btn" aria-label="Hapus bahan">&times;</button>';
        ingredientsList.appendChild(row);
    });

    document.getElementById('addStepBtn').addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'step-item';
        row.innerHTML = '<textarea placeholder="Tulis langkah pembuatan" rows="2" required></textarea><button type="button" class="remove-btn" aria-label="Hapus langkah">&times;</button>';
        stepsList.appendChild(row);
    });

    form.addEventListener('click', event => {
        const button = event.target.closest('.remove-btn');
        if (!button) return;
        const row = button.parentElement;
        const list = row.parentElement;
        if (list.children.length > 1) row.remove();
        else row.querySelector('input, textarea').value = '';
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const image = imagePreview.querySelector('img')?.src;
        if (!image) {
            alert('Tambahkan foto resep terlebih dahulu.');
            return;
        }

        const ingredients = [...ingredientsList.querySelectorAll('input')]
            .map(input => input.value.trim()).filter(Boolean);
        const steps = [...stepsList.querySelectorAll('textarea')]
            .map(textarea => textarea.value.trim()).filter(Boolean);
        if (!ingredients.length || !steps.length) {
            alert('Isi minimal satu bahan dan satu langkah memasak.');
            return;
        }

        const recipe = {
            id: globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
            title: document.getElementById('recipeTitle').value.trim(),
            image,
            cookingTime: Number(document.getElementById('cookingTime').value),
            servings: Number(document.getElementById('servings').value),
            description: document.getElementById('recipeDescription').value.trim(),
            ingredients,
            steps,
            isPrivate: document.getElementById('isPrivate').checked,
            createdAt: new Date().toISOString(),
            author: { name: getCurrentUsername(), avatar: '' }
        };

        try {
            await recipeRepository.save(recipe);
            alert(recipe.isPrivate
                ? 'Resep berhasil disimpan sebagai private dan menunggu approval admin.'
                : 'Resep berhasil dikirim dan menunggu approval admin.');
            window.location.href = 'my-recipes.html';
        } catch (error) {
            console.error('Gagal menyimpan resep:', error);
            alert('Resep gagal disimpan. Periksa ruang penyimpanan browser Anda.');
        }
    });
});
