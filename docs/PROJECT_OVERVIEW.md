# Project Overview - Penyusun Jadwal Pelajaran Otomatis

## 📋 Ringkasan Proyek

Aplikasi web komprehensif untuk membuat jadwal pelajaran sekolah secara otomatis dengan jaminan **100% bebas bentrok**.

## 🎯 Tujuan Utama

1. **Otomasi Penjadwalan**: Menghasilkan jadwal pelajaran otomatis tanpa bentrok
2. **Efisiensi Waktu**: Mengurangi waktu pembuatan jadwal dari minggu menjadi menit
3. **Optimasi Sumber Daya**: Distribusi optimal guru, ruang, dan mata pelajaran
4. **Fleksibilitas**: Mendukung berbagai struktur sekolah dan aturan khusus
5. **Kemudahan Penggunaan**: Interface intuitif untuk berbagai level user

## 🧮 Algoritma Penjadwalan

### Hybrid Multi-Algorithm Approach

1. **Constraint Satisfaction Problem (CSP)**
   - Validasi semua constraint
   - Backtracking dengan constraint propagation
   - Initial feasibility check

2. **Genetic Algorithm (GA)**
   - Optimasi global untuk distribusi optimal
   - Population Size: 100-200
   - Generations: 1000-5000
   - Convergence: 95% satisfaction

3. **Simulated Annealing (SA)**
   - Fine-tuning dan escape local optima
   - Temperature Schedule: Exponential cooling
   - Iterations: 10000-50000

4. **Backtracking (BT)**
   - Fallback untuk solusi feasible
   - MRV (Minimum Remaining Values) heuristic

## 📊 Constraint & Aturan

### Hard Constraints (Tidak boleh dilanggar)
- Guru tidak mengajar di 2+ kelas simultaneously
- 1 kelas = 1 mata pelajaran per slot waktu
- 1 ruang tidak digunakan 2+ kelas simultaneously
- Beban guru sesuai alokasi
- Mata pelajaran sesuai jumlah JP
- Guru hanya mengajar mata pelajaran yang diampu
- Ketersediaan guru terpenuhi

### Soft Constraints (Preferensi)
- Preferensi hari/jam guru
- Jam istirahat & libur
- Maksimal jam berturut-turut
- Distribusi merata seminggu
- Larangan jam pertama/akhir
- Praktik di laboratorium
- Shift pagi/siang/malam

## 👥 Role & Stakeholder

- **Super Admin**: Manajemen user, sistem global, backup
- **Admin/Kurikulum**: Setup data, generate jadwal, konfigurasi
- **Kepala Sekolah**: View jadwal, approve, laporan
- **Guru**: View jadwal pribadi, preferensi
- **Viewer**: View jadwal publik, export

## 🏗️ Database Schema

Lihat [DATABASE.md](DATABASE.md) untuk detail lengkap.

## 🔐 Security

- JWT Authentication
- Role-based Access Control
- Input Validation & Sanitization
- SQL Injection Prevention (Prisma ORM)
- XSS Protection (React)
- CSRF Tokens
- Rate Limiting
- Password Hashing (bcrypt)
- Audit Logging

## 📈 Performance Target

- Schedule generation: < 5 seconds untuk 500+ jam pelajaran
- API response: < 200ms p95
- Frontend bundle: < 500KB gzipped
- Solution quality: 95%+ soft constraint satisfaction

## 📚 Dokumentasi

- [Setup Guide](SETUP.md)
- [API Documentation](API.md)
- [Architecture](ARCHITECTURE.md)
- [Algorithm Details](ALGORITHM.md)
- [Database Schema](DATABASE.md)
- [Deployment](DEPLOYMENT.md)
