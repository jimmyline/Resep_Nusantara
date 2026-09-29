import { getCurrentUsername } from './data/api-client.js';

document.addEventListener('DOMContentLoaded', () => {
    const displayUsername = document.getElementById('displayUsername');
    if (displayUsername) displayUsername.textContent = getCurrentUsername();

    const mobileMenuButton = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    mobileMenuButton?.addEventListener('click', () => navLinks?.classList.toggle('active'));
});
