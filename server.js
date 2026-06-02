const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { doubleCsrf } = require("csrf-csrf");

const app = express();

// === FIX 1: AKTIFKAN TRUST PROXY UNTUK PROV-RAILWAY AGAR RATE-LIMIT TIDAK CRASH ===
app.set('trust proxy', 1);

// Konfigurasi Database
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prime_property'
});

db.connect((err) => {
    if (err) {
        console.error('Database error:', err);
    } else {
        // Fix string log biar gak bikin bingung
        console.log(`Terhubung ke database: ${process.env.DB_NAME || 'prime_property'} di ${process.env.DB_HOST || 'localhost'}`);
    }
});

// AC-9.2: Global Rate Limiting (100 req/menit)
const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 100,
    message: { message: "Terlalu banyak permintaan dari IP ini." }
});
app.use(globalLimiter);

// AC-9.2: Auth Rate Limiting (10 req/menit)
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: { message: "Terlalu banyak percobaan login, silakan coba lagi nanti." }
});

// AC-4.2: Contact Form Rate Limiting (3 req/jam)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { message: "Batas pengiriman pesan tercapai (Maks 3 per jam)." }
});

app.use(cors({
    origin: true, 
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// AC-9.2: Konfigurasi CSRF Protection menggunakan Double Submit Cookie Pattern
const csrfUtils = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "prime-property-very-secret-key-2026",
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: false, 
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
    },
    getSessionIdentifier: (req) => req.cookies.user_id || "anonymous-session",
    getTokenFromRequest: (req) => req.headers["x-csrf-token"], 
});

const doubleCsrfProtection = csrfUtils.doubleCsrfProtection;
const csrfTokenGenerator = csrfUtils.generateToken || csrfUtils.doubleCsrfToken || csrfUtils.generateCsrfToken;

// Endpoint untuk mendapatkan CSRF Token baru
app.get("/api/auth/csrf-token", (req, res) => {
    if (!csrfTokenGenerator || typeof csrfTokenGenerator !== 'function') {
        console.error("[CSRF Error] Available keys in csrfUtils:", Object.keys(csrfUtils));
        return res.status(500).json({ 
            message: "CSRF Generator tidak ditemukan. Silakan jalankan 'npm install csrf-csrf@latest' di terminal." 
        });
    }
    res.json({ token: csrfTokenGenerator(req, res) });
});

// Error handler khusus untuk kegagalan validasi CSRF
app.use((error, req, res, next) => {
    if (error.code === "EBADCSRFTOKEN") {
        return res.status(403).json({ message: "Invalid CSRF Token. Silakan muat ulang halaman." });
    }
    next(error);
});

// Middleware untuk proteksi rute
const authorizeSuperadmin = (req, res, next) => {
    const roleId = req.cookies.role_id; 

    if (parseInt(roleId) !== 1) {
        console.log(`[AUTH] Akses Ditolak ke ${req.path}. Role ID dari Cookie: ${roleId}`);
        return res.status(403).json({ 
            message: "Akses Ditolak: Hanya untuk Superadmin. Pastikan Anda login dengan akun Superadmin." 
        });
    }
    next();
};

// AC-8.2: Helper untuk Audit Log
const createAuditLog = (userId, action, details) => {
    const sql = "INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, NOW())";
    db.query(sql, [userId, action, JSON.stringify(details)], (err) => {
        if (err) console.error("Audit Log Error:", err);
    });
};

// Gunakan authLimiter di rute login
app.post('/api/auth/login', authLimiter, doubleCsrfProtection, (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password;
    
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({ message: "Database Error", details: err.message });
        }
        
        if (results.length > 0) {
            const user = results[0];

            if (user.locked_until && new Date(user.locked_until) > new Date()) {
                const remainingTime = Math.ceil((new Date(user.locked_until) - new Date()) / 1000 / 60);
                console.log(`[AUTH] Akun ${user.email} DITOLAK: Masih terkunci ${remainingTime} menit.`);
                return res.status(403).json({ 
                    message: `Akun terkunci sementara. Silakan coba lagi dalam ${remainingTime} menit.` 
                });
            }

            try {
                console.log(`[DEBUG] Password Input: "${password}" | Panjang: ${password?.length}`);
                console.log(`[DEBUG] Hash di DB: "${user.password}" | Panjang: ${user.password?.length}`);

                const match = await bcrypt.compare(password, user.password);
                
                if (match) {
                    console.log(`[AUTH] Login Berhasil: ${user.email}`);
                    db.query("UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?", [user.id], (uErr) => {
                        if (uErr) console.error("Gagal reset login attempts:", uErr.message);
                    });

                    const cookieOptions = {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'Lax',
                        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 hari
                    };

                    res.cookie('user_id', user.id, cookieOptions);
                    res.cookie('role_id', user.role_id, cookieOptions);

                    res.json({ 
                        message: "Login Berhasil", 
                        user: { id: user.id, nama_lengkap: user.nama_lengkap, role_id: user.role_id }
                    });
                } else {
                    const newAttempts = (user.failed_attempts || 0) + 1;
                    let lockSql = "UPDATE users SET failed_attempts = ? WHERE id = ?";
                    if (newAttempts >= 5) {
                        lockSql = "UPDATE users SET failed_attempts = ?, locked_until = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE id = ?";
                    }
                    db.query(lockSql, [newAttempts, user.id], (lErr) => {
                        if (lErr) console.error("Gagal update lockout status:", lErr.message);
                    });
                    console.log(`[AUTH] GAGAL: Password salah untuk ${user.email} (Percobaan ke-${newAttempts})`);
                    res.status(401).json({ message: "Email atau Password salah" });
                }
            } catch (bcryptError) {
                console.error("Bcrypt Error:", bcryptError);
                res.status(500).json({ message: "Error saat verifikasi keamanan" });
            }
        } else {
            console.log(`[AUTH] Email tidak terdaftar: ${email}`);
            res.status(401).json({ message: "Email atau Password salah" });
        }
    });
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('user_id');
    res.clearCookie('role_id');
    res.json({ message: "Logout Berhasil" });
});

app.post('/api/contact', contactLimiter, doubleCsrfProtection, (req, res) => {
    const { nama, email, phone, pesan } = req.body;
    console.log(`Notifikasi Email Admin: Pesan baru dari ${nama} (${email})`);
    res.json({ message: "Pesan terkirim, tim kami akan menghubungi Anda." });
});

// --- RUTE MANAJEMEN USER ---
app.get('/api/users', authorizeSuperadmin, (req, res) => {
    const sql = "SELECT id, nama_lengkap, email, role_id, created_at FROM users";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/users', authorizeSuperadmin, doubleCsrfProtection, async (req, res) => {
    const { nama_lengkap, email, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (nama_lengkap, email, password, role_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [nama_lengkap, email, hashedPassword, role_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal tambah user", error: err });
        createAuditLog(req.cookies.user_id, 'CREATE_USER', { 
            target_user_id: result.insertId, 
            email: email 
        });
        res.json({ message: "User berhasil dibuat", id: result.insertId });
    });
});

app.delete('/api/users/:id', authorizeSuperadmin, doubleCsrfProtection, (req, res) => {
    const userId = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) return res.status(500).json(err);
        createAuditLog(req.cookies.user_id, 'DELETE_USER', { target_user_id: userId });
        res.json({ message: "User dihapus" });
    });
});

app.patch('/api/users/:id/role', authorizeSuperadmin, doubleCsrfProtection, (req, res) => {
    const { role_id } = req.body;
    db.query("UPDATE users SET role_id = ? WHERE id = ?", [role_id, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        createAuditLog(req.cookies.user_id, 'UPDATE_USER_ROLE', { target_user_id: req.params.id, new_role: role_id });
        res.json({ message: "Role diperbarui" });
    });
});

// --- RUTE PROPERTI ---
app.get('/api/properties', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const showArchived = req.query.archived === 'true';
    const offset = (page - 1) * limit;

    let sql = `SELECT SQL_CALC_FOUND_ROWS * FROM properties WHERE ${showArchived ? 'deleted_at IS NOT NULL' : 'deleted_at IS NULL'}`;
    const queryParams = [];

    if (req.query.kawasan) {
        const kawasanArr = (Array.isArray(req.query.kawasan) ? req.query.kawasan : req.query.kawasan.split(','))
            .map(s => s.trim()).filter(s => s !== "");
        if (kawasanArr.length > 0) {
            sql += ' AND kawasan IN (?)';
            queryParams.push(kawasanArr);
        }
    }

    if (req.query.hadap) {
        const hadapArr = (Array.isArray(req.query.hadap) ? req.query.hadap : req.query.hadap.split(','))
            .map(s => s.trim()).filter(s => s !== "");
        if (hadapArr.length > 0) {
            sql += ' AND hadap IN (?)';
            queryParams.push(hadapArr);
        }
    }

    if (req.query.lebar_min) {
        sql += ' AND lebar >= ?';
        queryParams.push(req.query.lebar_min);
    }

    if (req.query.price_max) {
        sql += ' AND price <= ?';
        queryParams.push(req.query.price_max);
    }

    if (req.query.tipe) {
        sql += ' AND tipe = ?';
        queryParams.push(req.query.tipe);
    }
    if (req.query.status) {
        sql += ' AND status = ?';
        queryParams.push(req.query.status);
    }

    if (req.query.siap) {
        const siapArr = (Array.isArray(req.query.siap) ? req.query.siap : req.query.siap.split(','));
        sql += ' AND siap IN (?)';
        queryParams.push(siapArr);
    }

    if (req.query.carport !== undefined && req.query.carport !== 'all') {
        sql += ' AND carport = ?';
        queryParams.push(req.query.carport === 'true' ? 1 : 0);
    }

    if (req.query.search) {
        sql += ' AND (nama_property LIKE ? OR `group` LIKE ? OR kawasan LIKE ?)';
        const searchVal = `%${req.query.search}%`;
        queryParams.push(searchVal, searchVal, searchVal);
    }

    const validSortFields = ['nama_property', 'price', 'created_at', 'status'];
    const sortBy = validSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'created_at';
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
    
    const sortColumn = sortBy === 'group' ? `\`group\`` : sortBy;
    
    sql += ` ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Gagal ambil data", error: err.message });
        }
        
        db.query('SELECT FOUND_ROWS() as total', (err2, countRes) => {
            res.json({
                data: results,
                total: countRes[0].total,
                page,
                limit
            });
        });
    });
});

app.get('/api/properties/featured', (req, res) => {
    const sql = `SELECT * FROM properties 
                 WHERE status = 'in_stock' AND deleted_at IS NULL 
                 ORDER BY created_at DESC LIMIT 3`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal ambil featured" });
        res.json(results);
    });
});

app.post('/api/properties', authorizeSuperadmin, doubleCsrfProtection, (req, res) => {
    const { nama_property, group, kawasan, tipe, lebar, panjang, hadap, tingkat, carport, price, status, siap, maps_link, unit } = req.body;
    const created_by = req.cookies.user_id;

    if (!nama_property || nama_property.length < 3 || nama_property.length > 100) {
        return res.status(400).json({ message: "Nama properti harus 3-100 karakter." });
    }
    if (price <= 0 || isNaN(price)) {
        return res.status(400).json({ message: "Harga harus berupa angka positif." });
    }
    if (lebar <= 0 || panjang <= 0) {
        return res.status(400).json({ message: "Dimensi harus lebih dari 0." });
    }
    if (tingkat < 1 || tingkat > 10) {
        return res.status(400).json({ message: "Jumlah tingkat harus antara 1 sampai 10." });
    }
    if (maps_link && !maps_link.includes('google.com/maps')) {
        return res.status(400).json({ message: "Link Maps harus berasal dari domain google.com/maps" });
    }
    
    const sql = `INSERT INTO properties 
                 (nama_property, \`group\`, kawasan, tipe, lebar, panjang, hadap, tingkat, carport, price, status, siap, maps_link, unit, created_by) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nama_property, group, kawasan, tipe, lebar, panjang, hadap, tingkat, carport, price, status, siap, maps_link, unit, created_by], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Gagal menyimpan data", error: err });
        }
        createAuditLog(req.cookies.user_id, 'CREATE_PROPERTY', { 
            id: result.insertId, 
            name: nama_property,
            details: req.body 
        });
        res.json({ message: 'Success', id: result.insertId });
    });
});

app.put('/api/properties/:id', authorizeSuperadmin, doubleCsrfProtection, async (req, res) => {
    const { id } = req.params;
    const { nama_property, group, kawasan, tipe, lebar, panjang, hadap, tingkat, carport, price, status, siap, maps_link, unit } = req.body;

    if (!nama_property || nama_property.length < 3 || nama_property.length > 100) {
        return res.status(400).json({ message: "Nama properti harus 3-100 karakter." });
    }
    if (price <= 0 || isNaN(price)) {
        return res.status(400).json({ message: "Harga harus berupa angka positif." });
    }
    if (lebar <= 0 || panjang <= 0) {
        return res.status(400).json({ message: "Dimensi harus lebih dari 0." });
    }
    if (tingkat < 1 || tingkat > 10) {
        return res.status(400).json({ message: "Jumlah tingkat harus antara 1 sampai 10." });
    }
    if (maps_link && !maps_link.includes('google.com/maps')) {
        return res.status(400).json({ message: "Link Maps harus berasal dari domain google.com/maps" });
    }

    db.query('SELECT * FROM properties WHERE id = ?', [id], (oldErr, oldResults) => {
        if (oldErr || oldResults.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        const oldData = oldResults[0];

        const sql = `UPDATE properties SET 
                     nama_property = ?, \`group\` = ?, kawasan = ?, tipe = ?, lebar = ?, 
                     panjang = ?, hadap = ?, tingkat = ?, carport = ?, price = ?, 
                     status = ?, siap = ?, maps_link = ?, unit = ?
                     WHERE id = ?`;

        db.query(sql, [nama_property, group, kawasan, tipe, lebar, panjang, hadap, tingkat, carport, price, status, siap, maps_link, unit, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Gagal update data", error: err });
            }
            
            createAuditLog(req.cookies.user_id, 'UPDATE_PROPERTY', { 
                property_id: id, 
                changes: { from: oldData, to: req.body } 
            });
            res.json({ message: 'Updated' });
        });
    });
});

app.delete('/api/properties/:id', authorizeSuperadmin, doubleCsrfProtection, (req, res) => {
    const sql = 'UPDATE properties SET deleted_at = NOW() WHERE id = ?';
    const { id } = req.params;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        createAuditLog(req.cookies.user_id, 'DELETE_PROPERTY', { property_id: id, timestamp: new Date() });
        res.json({ message: 'Deleted' });
    });
});

app.put('/api/properties/restore/:id', authorizeSuperadmin, doubleCsrfProtection, (req, res) => {
    const sql = 'UPDATE properties SET deleted_at = NULL WHERE id = ?';
    const { id } = req.params;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        createAuditLog(req.cookies.user_id, 'RESTORE_PROPERTY', { property_id: id, timestamp: new Date() });
        res.json({ message: 'Properti berhasil dipulihkan' });
    });
});

app.get('/api/properties/stats', (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'in_stock' THEN 1 ELSE 0 END) as in_stock,
            SUM(CASE WHEN status = 'sold_out' THEN 1 ELSE 0 END) as sold_out,
            COALESCE(SUM(CASE WHEN status = 'in_stock' THEN price ELSE 0 END), 0) as total_value,
            SUM(CASE WHEN tipe = 'Ruko' THEN 1 ELSE 0 END) as ruko,
            SUM(CASE WHEN tipe = 'Villa' THEN 1 ELSE 0 END) as villa
        FROM properties 
        WHERE deleted_at IS NULL
    `;
    
    const sqlKawasan = `
        SELECT kawasan, COUNT(*) as count 
        FROM properties WHERE deleted_at IS NULL AND status = 'in_stock'
        GROUP BY kawasan ORDER BY count DESC LIMIT 3`;

    db.query(sql, (err, statsRes) => {
        if (err) return res.status(500).json({ message: "Gagal" });
        db.query(sqlKawasan, (err2, kawasanRes) => {
            if (err2) return res.status(500).json({ message: "Gagal" });
            res.json({ ...statsRes[0], top_kawasan: kawasanRes });
        });
    });
});

const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Backend berjalan di http://localhost:${PORT}`));