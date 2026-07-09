# Penyusun Jadwal Pelajaran Otomatis (Anti Bentrok)

Aplikasi web modern untuk membuat jadwal pelajaran sekolah secara otomatis dengan jaminan **100% bebas bentrok**. Sistem ini dilengkapi dengan berbagai fitur manajemen, algoritma optimasi advanced, dan interface yang user-friendly.

## 🎯 Fitur Utama

### Manajemen Data
- ✅ Pengelolaan Tahun Ajaran & Semester
- ✅ Hari Efektif & Jam Pelajaran
- ✅ Mata Pelajaran & Guru
- ✅ Kelas, Ruang, Jurusan & Tingkat
- ✅ Rombel & Beban Mengajar Guru
- ✅ Wali Kelas & Pengaturan Aturan Penjadwalan

### Penjadwalan
- ✅ Mode Manual (Drag & Drop)
- ✅ Mode Otomatis (Multi-Algorithm CSP + Genetic)
- ✅ Deteksi Konflik Real-time
- ✅ Rekomendasi Solusi Otomatis
- ✅ Lock/Unlock Jadwal
- ✅ Regenerasi Sebagian
- ✅ Simulasi Perubahan

### Analitik & Reporting
- ✅ Dashboard Interaktif
- ✅ Statistik Kualitas Jadwal
- ✅ Grafik Distribusi Beban Guru
- ✅ Penggunaan Ruang
- ✅ Ekspor PDF & Excel
- ✅ Riwayat Perubahan & Audit Log

### Security & Access Control
- ✅ Role-Based Access Control (RBAC)
- ✅ Login berbasis role (Super Admin, Admin, Kepala Sekolah, Guru, Viewer)
- ✅ SQL Injection Prevention
- ✅ XSS & CSRF Protection
- ✅ Input Validation
- ✅ Secure Authentication (JWT)

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- PostgreSQL + Prisma ORM
- Redis (Caching & Queue)
- JWT Authentication
- Joi Validation

### Frontend
- React 18 + TypeScript
- Tailwind CSS + ShadcN UI
- React Query (Data Fetching)
- Zustand (State Management)
- Recharts (Visualisasi)
- React Big Calendar

### Scheduling Engine
- Constraint Satisfaction Problem (CSP)
- Genetic Algorithm
- Simulated Annealing
- Backtracking
- Hybrid Approach

## 📁 Struktur Project

```
jadwal-pelajaran-otomatis/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── scheduling/
│   │   ├── validators/
│   │   ├── routes/
│   │   ├── types/
│   │   └── main.ts
│   ├── prisma/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── App.tsx
│   └── package.json
├── docs/
└── docker-compose.yml
```

## 🚀 Quick Start

### Dengan Docker
```bash
git clone https://github.com/baradacode26/jadwal-pelajaran-otomatis.git
cd jadwal-pelajaran-otomatis
docker-compose up -d
```

### Manual Setup
```bash
# Backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (terminal baru)
cd frontend
npm install
npm run dev
```

## 📖 Dokumentasi

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Scheduling Algorithm](docs/ALGORITHM.md)

## 👥 Role & Permission

| Role | Create | Read | Update | Delete | Generate | Export |
|------|--------|------|--------|--------|----------|--------|
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin/Kurikulum | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kepala Sekolah | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Guru | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Viewer | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

## 📝 License

MIT License

---

**Dibuat dengan ❤️ untuk pendidikan Indonesia**
