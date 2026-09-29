<<<<<<< HEAD
Resep Nusantara adalah aplikasi web berbagi resep masakan Indonesia yang saya bangun menggunakan HTML, CSS, dan JavaScript murni sebagai proyek pertama saya dalam pengembangan web. Aplikasi ini memungkinkan pengguna untuk mendaftar akun, login, menelusuri resep-resep masakan Nusantara seperti Gado-Gado, Nasi Kuning, dan Ayam Woku, serta mengunggah resep buatan sendiri lengkap dengan foto, bahan-bahan, dan langkah pembuatan.

Fitur utama yang diimplementasikan meliputi sistem autentikasi berbasis localStorage, carousel banner interaktif dengan dukungan swipe di perangkat mobile, fungsi pencarian resep secara real-time, serta halaman "Resep Saya" dan "Resep Disimpan" yang dikelola secara dinamis melalui JavaScript. Seluruh data pengguna dan resep disimpan di localStorage browser tanpa memerlukan backend server.

Dari sisi desain, saya menerapkan layout responsif menggunakan CSS Grid dan Flexbox, dengan palet warna merah marun (#680707) sebagai identitas visual yang konsisten di seluruh halaman. Proyek ini diorganisir dengan struktur folder yang rapi — memisahkan file HTML, CSS (css/), JavaScript (js/), dan gambar (images/) — sehingga mudah dikembangkan lebih lanjut.

Melalui proyek ini, saya mempelajari dasar-dasar struktur dokumen HTML, penataan tampilan dengan CSS, manipulasi DOM dengan JavaScript, serta pengelolaan state sederhana menggunakan Web Storage API.
=======
# Resep Nusantara

Website resep berbasis HTML, CSS, dan JavaScript ES modules. Pengguna dapat membagikan resep, menjelajahi resep publik, menyimpan resep, serta memberi rating dan komentar.

## Menjalankan

Pastikan Node.js 20 atau lebih baru sudah terpasang, lalu jalankan:

```bash
npm install
npm start
```

Buka `http://localhost:3000/Login.html`. Backend menyajikan frontend sekaligus API, sehingga halaman tidak perlu dibuka melalui skema `file://`.

Untuk development, akun admin awal menggunakan `admin` dan `admin12345`. Ganti nilainya dengan `ADMIN_USERNAME` dan `ADMIN_PASSWORD` di `.env` sebelum digunakan di luar development.

## Struktur aplikasi

```text
frontend/
  css/               Gaya per halaman dan gaya bersama
  images/            Aset gambar
  js/
    data/            API client dan repository frontend
    pages/           Controller/inisialisasi per halaman
    services/        Aturan aplikasi resep dan ulasan
    ui/              Komponen tampilan yang dapat digunakan kembali
backend/
  app.js             Composition root HTTP server
  db.js              Koneksi serta schema MySQL XAMPP
  routes/            Route HTTP per fitur
  services/          Aturan bisnis dan validasi server
  repositories/      Query database
  middleware/        Autentikasi dan otorisasi
data/                Backup SQLite lama, tidak digunakan runtime
*.html               Halaman statis aplikasi
```

Alur data mengikuti `pages -> services -> data -> API -> MySQL XAMPP`. Backend mengelola pengguna, password yang di-hash, resep, resep tersimpan, rating, dan komentar. Resep private hanya dapat diakses pemiliknya.

Database runtime adalah MySQL/MariaDB dari XAMPP dengan nama `resep_nusantara`. Konfigurasi koneksi berada di `.env` berdasarkan template `.env.example`. Schema dan data awal dibuat otomatis oleh `backend/db.js` saat server pertama kali dijalankan.

## Endpoint utama

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/recipes`
- `GET /api/recipes/mine`
- `POST /api/recipes`
- `DELETE /api/recipes/:id`
- `GET /api/admin/recipes`
- `PATCH /api/admin/recipes/:id/status`
- `GET|POST /api/recipes/:id/reviews`
- `GET /api/recipes/saved/list`
- `POST|DELETE /api/recipes/saved/:id`
- `GET /api/events`
- `GET /api/admin/events`
- `POST /api/admin/events`
- `DELETE /api/admin/events/:id`

## Moderasi dan event

Upload resep pengguna selalu masuk status `pending` dan tidak muncul di halaman publik sampai admin menyetujuinya. Admin dapat membuka `http://localhost:3000/admin.html` untuk menyetujui atau menolak request resep.

Admin juga dapat mempublikasikan event dengan poster, tanggal, lokasi, deskripsi, dan link pendaftaran Google Form. Event yang sudah dibuat tampil otomatis di beranda publik.
>>>>>>> b3e8d3e (Update homepage and authentication UI)
