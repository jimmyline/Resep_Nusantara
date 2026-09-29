import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const databaseName = process.env.DB_NAME || 'resep_nusantara';
const mysqlConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: databaseName,
    namedPlaceholders: true,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true
};

export let db;

export async function initializeDatabase() {
    const bootstrap = await mysql.createConnection({
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password
    });
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await bootstrap.end();

    db = mysql.createPool(mysqlConfig);
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(150) NOT NULL,
            username VARCHAR(80) NOT NULL UNIQUE,
            email VARCHAR(150) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS recipes (
            id VARCHAR(36) PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(150) NOT NULL,
            image LONGTEXT NOT NULL,
            cooking_time INT NOT NULL,
            servings INT NOT NULL,
            description TEXT NOT NULL,
            ingredients JSON NOT NULL,
            steps JSON NOT NULL,
            is_private BOOLEAN NOT NULL DEFAULT FALSE,
            status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
            rejection_reason TEXT,
            created_at DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            recipe_id VARCHAR(36) NOT NULL,
            user_id INT NOT NULL,
            rating TINYINT NOT NULL,
            comment TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_recipe_user_review (recipe_id, user_id),
            CHECK (rating BETWEEN 1 AND 5),
            FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS saved_recipes (
            user_id INT NOT NULL,
            recipe_id VARCHAR(36) NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, recipe_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS events (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            poster LONGTEXT NOT NULL,
            event_date DATETIME NOT NULL,
            location VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            registration_url TEXT NOT NULL,
            created_by INT NOT NULL,
            created_at DATETIME NOT NULL,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    `);

    await seedInitialData();
}

async function seedInitialData() {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
    await db.execute(
        'INSERT IGNORE INTO users (fullname, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        ['Administrator', adminUsername, `${adminUsername}@resep-nusantara.local`, bcrypt.hashSync(adminPassword, 12), 'admin']
    );
    const [userRows] = await db.execute('SELECT id FROM users WHERE username = ?', ['fredelica']);
    let demoUserId = userRows[0]?.id;
    if (!demoUserId) {
        const [result] = await db.execute(
            'INSERT INTO users (fullname, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            ['Fredelica', 'fredelica', 'fredelica@resep-nusantara.local', bcrypt.hashSync('demo12345', 12), 'user']
        );
        demoUserId = result.insertId;
    }

    const demoRecipes = [
        ['gado', 'Gado-Gado', 'images/gado.jpg', 60, 4, 'Gado-gado adalah hidangan sayuran rebus dengan bumbu kacang khas Nusantara.', ['Kubis atau kol', 'Bayam', 'Mentimun', 'Tauge', 'Kentang', 'Kacang panjang', 'Tahu kuning', 'Telur'], ['Cuci bersih semua sayuran.', 'Rebus sayuran dan kentang hingga matang.', 'Goreng tahu dan rebus telur.', 'Haluskan kacang bersama bumbu.', 'Siram sayuran dengan saus kacang.']],
        ['nasikuning', 'Nasi Kuning', 'images/nasikuning.jpg', 60, 6, 'Nasi kuning berbumbu santan dan kunyit khas Nusantara.', ['Beras 3 cup', 'Santan 200 ml', 'Daun pandan', 'Serai', 'Daun jeruk', 'Daun salam', 'Bawang merah', 'Bawang putih', 'Kunyit', 'Garam'], ['Cuci beras.', 'Masak santan dan bumbu hingga mendidih.', 'Tuang santan berbumbu ke rice cooker.', 'Masak hingga matang lalu aduk rata.']],
        ['ayamwoku', 'Ayam Bumbu Woku', 'images/woku.jpg', 45, 4, 'Ayam woku khas Manado dengan bumbu segar dan rempah yang kaya rasa.', ['Ayam', 'Kemangi', 'Bawang merah', 'Bawang putih', 'Cabai', 'Kemiri', 'Jahe', 'Kunyit', 'Tomat', 'Serai'], ['Rebus ayam lalu cuci bersih.', 'Tumis bumbu hingga harum.', 'Masukkan ayam dan air.', 'Masak hingga kuah mengental lalu tambahkan kemangi.']]
    ];
    for (const [id, title, image, cookingTime, servings, description, ingredients, steps] of demoRecipes) {
        await db.execute(`
            INSERT IGNORE INTO recipes (id, user_id, title, image, cooking_time, servings, description, ingredients, steps, is_private, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, 'approved', ?)
        `, [id, demoUserId, title, image, cookingTime, servings, description, JSON.stringify(ingredients), JSON.stringify(steps), '2024-05-20 00:00:00']);
    }
}

function parseJson(value) {
    return typeof value === 'string' ? JSON.parse(value) : value;
}

export function serializeRecipe(row) {
    if (!row) return null;
    return {
        id: row.id,
        title: row.title,
        image: row.image,
        cookingTime: row.cookingTime,
        servings: row.servings,
        description: row.description,
        ingredients: parseJson(row.ingredients),
        steps: parseJson(row.steps),
        isPrivate: Boolean(row.isPrivate),
        status: row.status,
        rejectionReason: row.rejectionReason || '',
        createdAt: row.createdAt,
        rating: row.ratingAverage ? Number(row.ratingAverage) : 0,
        ratingCount: Number(row.ratingCount || 0),
        author: { name: row.authorName }
    };
}
