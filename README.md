**Resep Nusantara** is a web-based platform for sharing Indonesian recipes, developed using pure HTML, CSS, and JavaScript as my first project in web development. The application allows users to create accounts, log in, browse a variety of Indonesian recipes such as Gado-Gado, Nasi Kuning, and Ayam Woku, and upload their own recipes complete with photos, ingredients, and preparation steps.

The main features implemented include a **localStorage-based authentication system**, an interactive banner carousel with swipe support for mobile devices, real-time recipe search functionality, as well as dynamically managed **"My Recipes"** and **"Saved Recipes"** pages using JavaScript. All user and recipe data are stored in the browser's localStorage, eliminating the need for a backend server.

From a design perspective, the application implements a **responsive layout using CSS Grid and Flexbox**, with maroon (#680707) as the primary visual identity applied consistently throughout the website. The project is organized using a clean folder structure, separating HTML, CSS (`css/`), JavaScript (`js/`), and image (`images/`) files, making the project easier to maintain and further develop.


Through this project, I gained a fundamental understanding of **HTML document structure, CSS-based styling and layout, DOM manipulation using JavaScript, and basic state management using the Web Storage API**.

# Resep Nusantara

A recipe-sharing website built with **HTML, CSS, and JavaScript ES modules**. Users can share recipes, explore public recipes, save recipes, and provide ratings and comments.

## Getting Started

Make sure **Node.js 20 or later** is installed, then run:

```bash
npm install
npm start
```

Open `http://localhost:3000/Login.html` in your browser. The backend serves both the frontend and API, so the pages do not need to be opened using the `file://` scheme.

For development purposes, the initial admin account uses `admin` and `admin12345`. Replace these credentials by setting `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` before using the application outside of a development environment.

## Application Structure

```text
frontend/
  css/               Page-specific and shared styles
  images/            Image assets
  js/
    data/            API client and frontend repositories
    pages/           Page-specific controllers and initialization
    services/        Recipe and review application logic
    ui/              Reusable UI components
backend/
  app.js             HTTP server composition root
  db.js              MySQL connection and schema configuration
  routes/            HTTP routes organized by feature
  services/          Business logic and server-side validation
  repositories/      Database queries
  middleware/        Authentication and authorization
data/                Legacy SQLite backup, not used at runtime
*.html               Static application pages
```

The data flow follows:

`pages -> services -> data -> API -> MySQL XAMPP`

The backend manages **users, hashed passwords, recipes, saved recipes, ratings, and comments**. Private recipes can only be accessed by their respective owners.

The runtime database uses **MySQL/MariaDB through XAMPP**, with `resep_nusantara` as the database name. Database connection settings are configured in `.env` based on the `.env.example` template. The database schema and initial data are automatically created by `backend/db.js` when the server is started for the first time.

## Main Endpoints

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`
* `GET /api/recipes`
* `GET /api/recipes/mine`
* `POST /api/recipes`
* `DELETE /api/recipes/:id`
* `GET /api/admin/recipes`
* `PATCH /api/admin/recipes/:id/status`
* `GET|POST /api/recipes/:id/reviews`
* `GET /api/recipes/saved/list`
* `POST|DELETE /api/recipes/saved/:id`
* `GET /api/events`
* `GET /api/admin/events`
* `POST /api/admin/events`
* `DELETE /api/admin/events/:id`

## Moderation and Events

User-submitted recipes are automatically assigned a `pending` status and remain hidden from the public until they are approved by an administrator. Administrators can access `http://localhost:3000/admin.html` to review, approve, or reject recipe submissions.

Administrators can also publish events with a poster, date, location, description, and Google Forms registration link. Once created, published events are automatically displayed on the public homepage.

