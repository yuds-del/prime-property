# Prime Property - Asset Management Platform

Prime Property adalah platform manajemen aset real estate premium yang mengintegrasikan halaman publik pemasaran dengan portal manajemen internal untuk agen dan admin. Sistem ini dirancang dengan fokus pada presisi data, keamanan tingkat tinggi, dan pengalaman pengguna yang mewah.

##  Fitur Utama

### Halaman Publik (Frontend)
- **Landing Page**: Menampilkan properti unggulan (featured) secara dinamis dari database.
- **Tentang Kami**: Profil korporasi dengan desain 2 kolom yang responsif.
- **Hub Kontak**: Formulir komunikasi yang dilengkapi dengan *Rate Limiting* untuk mencegah spam.

### Portal Internal (Agent & Admin)
- **Dashboard Overview**: Statistik real-time (Total Listing, Nilai Portofolio, Kawasan Terpopuler).
- **Manajemen Listing**: CRUD operasional untuk properti (Villa & Ruko) dengan dukungan *Soft Delete*.
- **Sistem Arsip**: Fitur untuk melihat dan memulihkan (*restore*) data properti yang telah dihapus.
- **Manajemen User**: Pengelolaan akun internal (Superadmin & Agent) dan pengaturan hak akses (RBAC).
- **Audit Trail**: Pencatatan otomatis setiap aktivitas krusial (siapa, kapan, apa yang diubah).

##  Arsitektur Keamanan

Proyek ini mengimplementasikan standar keamanan industri:
- **CSRF Protection**: Menggunakan pola *Double Submit Cookie* dengan library `csrf-csrf`.
- **Brute Force Protection**: Pembatasan percobaan login (max 5x) dengan mekanisme *Account Lockout* selama 15 menit.
- **Password Security**: Enkripsi password menggunakan `bcrypt` dengan *salt rounds* standar industri.
- **Rate Limiting**: Perlindungan berlapis pada level global, autentikasi, dan formulir kontak.
- **Secure Cookies**: Pengaturan `HttpOnly` dan `SameSite: Lax` untuk manajemen sesi yang aman.

## 🚀 Teknologi yang Digunakan

**Backend:**
- Node.js & Express
- MySQL (Database)
- `mysql2` (Database Driver)
- `csrf-csrf` (Security)
- `express-rate-limit` (Traffic Control)

**Frontend:**
- Vue.js 3 (Composition API)
- Vite (Build Tool)
- Vue Router (Navigation)
- Tailwind CSS (Styling)
- Headless UI & Heroicons

##  Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- Node.js (v16 atau lebih baru)
- XAMPP atau MySQL Server

##  Instalasi

1. **Clone repositori:**
   ```bash
   git clone <https://github.com/username/prime-property.git>
   cd prime-property
   ```

2. **Instal Dependensi Backend:**
   ```bash
   npm install
   ```

3. **Instal Dependensi Frontend:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Konfigurasi Database:**
   - Buat database baru di phpMyAdmin dengan nama `prime_property`.
   - Impor file SQL yang disediakan (jika ada) atau jalankan migrasi struktur tabel.

5. **Konfigurasi Environment:**
   Buat file `.env` di direktori root dan sesuaikan:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=prime_property
   CSRF_SECRET=ganti_dengan_string_acak_anda
   NODE_ENV=development
   ```

##  Menjalankan Aplikasi

1. **Jalankan Backend:**
   ```bash
   node server.js
   ```
   Server akan berjalan di `http://localhost:3000`.

2. **Jalankan Frontend:**
   Buka terminal baru:
   ```bash
   cd frontend
   npm run dev
   ```
   Akses aplikasi di `http://localhost:5173`.

##  Akun Demo (Jika Menggunakan Seed Data)
- **Superadmin**: `yuds@yuds.my.id` / `password123`
- **Agent**: `tira@yuds.my.id` / `password123`

---

&copy; 2026 Prime Property Hub. Developed with  for Precision Asset Management.
```

<!--
[PROMPT_SUGGESTION]Bantu saya membuat script SQL untuk initial seed data user dan properti[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Bagaimana cara melakukan deployment project ini ke layanan hosting VPS?[/PROMPT_SUGGESTION]
