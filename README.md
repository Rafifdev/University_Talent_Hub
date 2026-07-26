<div align="center">

  # 🎓 TalentHub Kampus (University Talent Hub)

  Platform manajemen talenta mahasiswa berbasis web — tempat mahasiswa membangun profil profesional, mengelola skill, sertifikat & portofolio yang terverifikasi, mendapatkan rekomendasi AI, mengumpulkan poin reward, dan menemukan peluang karir, sementara admin kampus memverifikasi data dan memantau perkembangan talenta secara terpusat.

  [![Live Demo](https://img.shields.io/badge/demo-vercel-black?style=for-the-badge&logo=vercel)](https://university-talent-hub-indol.vercel.app/)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 🔗 Demo

Coba langsung aplikasinya di sini:

**🌐 [https://university-talent-hub-indol.vercel.app/](https://university-talent-hub-indol.vercel.app/)**

> ⚠️ Catatan: Karena aplikasi ini terhubung ke database Supabase, sebagian fitur (login, verifikasi, dsb) pada demo publik bergantung pada konfigurasi environment variable Supabase yang digunakan saat deploy.

## 📖 Tentang Proyek

**TalentHub Kampus** adalah aplikasi web untuk mengelola dan mengembangkan talenta mahasiswa di lingkungan universitas. Mahasiswa dapat membangun profil lengkap berisi skill, sertifikat, dan portofolio yang diverifikasi oleh admin, mendapatkan poin dari setiap pencapaian yang diverifikasi, memanfaatkan rekomendasi berbasis AI untuk pengembangan karir/skill/sertifikasi berikutnya, menukarkan poin dengan reward, serta menemukan peluang magang, kompetisi, dan beasiswa lewat *Opportunity Board*.

Di sisi lain, admin kampus mendapatkan dashboard analitik untuk memantau data mahasiswa secara komprehensif, memverifikasi pengajuan skill/sertifikat/portofolio, mengelola reward dan opportunity, serta melihat leaderboard mahasiswa paling berprestasi.

## 📸 Tampilan Aplikasi

<img width="1920" height="1362" alt="university_talent_hub" src="https://github.com/user-attachments/assets/3a90afa1-2e75-43fc-bcb5-ca74a4b19de9" />

## ✨ Fitur Utama

### 👨‍🎓 Untuk Mahasiswa
- 🪪 **Profil Profesional** — Membangun profil lengkap dengan data akademik, skill, sertifikat, dan portofolio.
- 🎯 **Manajemen Skill** — Menambahkan dan mengajukan skill untuk diverifikasi oleh admin.
- 📜 **Sertifikat** — Mengunggah sertifikat sebagai bukti pencapaian, menunggu proses verifikasi.
- 💼 **Portofolio** — Menampilkan karya/proyek terbaik yang dapat diverifikasi.
- 📤 **Submissions** — Melacak status semua pengajuan (skill/sertifikat/portofolio) yang sedang direview.
- 🧭 **Opportunity Board** — Menjelajahi peluang magang, kompetisi, dan beasiswa.
- 🤖 **AI Recommendation** — Rekomendasi cerdas untuk pengembangan karir, skill, dan sertifikasi selanjutnya.
- 🏆 **Leaderboard** — Peringkat mahasiswa berdasarkan poin pencapaian.
- 🎁 **Rewards & Riwayat Penukaran** — Mengumpulkan poin dan menukarkannya dengan hadiah, serta melihat riwayat penukaran.

### 🛡️ Untuk Admin
- 📊 **Dashboard Analitik** — Ringkasan data & statistik perkembangan talenta mahasiswa.
- 👥 **Manajemen Mahasiswa** — Melihat dan mengelola data seluruh mahasiswa terdaftar.
- ✅ **Verifikasi Skill** — Meninjau dan menyetujui/menolak pengajuan skill mahasiswa.
- ✅ **Verifikasi Sertifikat** — Meninjau keaslian sertifikat yang diunggah mahasiswa.
- ✅ **Verifikasi Portofolio** — Meninjau proyek/karya yang diajukan mahasiswa.
- 🎁 **Manajemen Reward** — Mengelola daftar reward yang dapat ditukar dengan poin.
- 💼 **Manajemen Opportunity** — Mengelola daftar magang, kompetisi, dan beasiswa yang ditampilkan ke mahasiswa.
- 🏆 **Leaderboard Admin** — Memantau peringkat pencapaian seluruh mahasiswa.

### 🔐 Umum
- 🔑 **Autentikasi & Role-based Access** — Login/registrasi dengan Supabase Auth, dengan pemisahan akses **student** dan **admin** secara otomatis berdasarkan role di profil pengguna.
- 🌗 **Dark/Light Mode** — Dukungan mode tampilan gelap dan terang.
- 🔔 **Notifikasi** — Sistem notifikasi dalam aplikasi terkait status verifikasi & aktivitas lain.

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework/Library | [React 19](https://react.dev/) |
| Bahasa | [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Backend & Database | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Row Level Security) |
| Routing | [React Router DOM v7](https://reactrouter.com/) |
| Form & Validasi | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Notifikasi UI | [Sonner](https://sonner.emilkowal.ski/) |
| Charting | [Recharts](https://recharts.org/) |
| Icon | [Lucide React](https://lucide.dev/) |

## 🗄️ Skema Database (Supabase)

Migrasi database tersedia di `supabase/migrations/` dan mencakup tabel-tabel berikut:

| Tabel | Fungsi |
|---|---|
| `profiles` | Data profil pengguna (mahasiswa/admin) beserta role |
| `skills` | Skill yang diajukan/dimiliki mahasiswa |
| `certificates` | Sertifikat yang diunggah mahasiswa |
| `portfolios` | Portofolio/proyek mahasiswa |
| `submissions` | Status pengajuan yang menunggu verifikasi admin |
| `point_history` | Riwayat perolehan poin mahasiswa |
| `rewards` | Daftar reward yang dapat ditukar dengan poin |
| `reward_redemptions` | Riwayat penukaran reward oleh mahasiswa |
| `opportunities` | Daftar magang, kompetisi, dan beasiswa |
| `opportunity_applications` | Data pengajuan/lamaran mahasiswa terhadap suatu opportunity |
| `notifications` | Notifikasi dalam aplikasi |

## 📁 Struktur Proyek

```
University_Talent_Hub/
├── public/
├── supabase/
│   └── migrations/               # Skema database & migrasi Supabase
├── src/
│   ├── components/
│   │   ├── layout/                # StudentLayout, AdminLayout (sidebar & navigasi)
│   │   ├── theme-provider.tsx
│   │   ├── mode-toggle.tsx
│   │   └── ui/                     # Komponen UI (shadcn/ui berbasis Radix UI)
│   ├── context/
│   │   └── AuthContext.tsx          # Context autentikasi & profil pengguna (Supabase Auth)
│   ├── hooks/
│   ├── lib/
│   │   └── supabase.ts               # Inisialisasi Supabase client
│   ├── pages/
│   │   ├── Landing.tsx               # Landing page publik
│   │   ├── Login.tsx                 # Halaman login/registrasi
│   │   ├── student/                  # Semua halaman untuk role mahasiswa
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Certificates.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Submissions.tsx
│   │   │   ├── Opportunities.tsx
│   │   │   ├── AIRecommendation.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── Rewards.tsx
│   │   │   └── RewardHistory.tsx
│   │   └── admin/                    # Semua halaman untuk role admin
│   │       ├── Dashboard.tsx
│   │       ├── Students.tsx
│   │       ├── SkillVerification.tsx
│   │       ├── CertificateVerification.tsx
│   │       ├── PortfolioVerification.tsx
│   │       ├── RewardManagement.tsx
│   │       ├── OpportunityManagement.tsx
│   │       └── Leaderboard.tsx
│   ├── types/                     # Definisi tipe TypeScript
│   ├── App.tsx                    # Root komponen & routing (protected routes by role)
│   └── main.tsx                   # Entry point aplikasi
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🗺️ Halaman & Routing

| Route | Role | Deskripsi |
|---|---|---|
| `/` | Publik | Landing page |
| `/login` | Publik | Login & registrasi |
| `/student/dashboard` | Student | Dashboard ringkasan mahasiswa |
| `/student/profile` | Student | Profil mahasiswa |
| `/student/skills` | Student | Manajemen skill |
| `/student/certificates` | Student | Manajemen sertifikat |
| `/student/portfolio` | Student | Manajemen portofolio |
| `/student/submissions` | Student | Status pengajuan verifikasi |
| `/student/opportunities` | Student | Daftar peluang magang/kompetisi/beasiswa |
| `/student/ai-recommendation` | Student | Rekomendasi AI |
| `/student/leaderboard` | Student | Papan peringkat mahasiswa |
| `/student/rewards` | Student | Penukaran reward |
| `/student/reward-history` | Student | Riwayat penukaran reward |
| `/admin/dashboard` | Admin | Dashboard analitik admin |
| `/admin/students` | Admin | Manajemen data mahasiswa |
| `/admin/skill-verification` | Admin | Verifikasi skill mahasiswa |
| `/admin/certificate-verification` | Admin | Verifikasi sertifikat |
| `/admin/portfolio-verification` | Admin | Verifikasi portofolio |
| `/admin/reward-management` | Admin | Manajemen reward |
| `/admin/opportunity-management` | Admin | Manajemen opportunity |
| `/admin/leaderboard` | Admin | Leaderboard sisi admin |

> Akses ke rute `/student/*` dan `/admin/*` dilindungi oleh `ProtectedRoute` yang memeriksa status login dan role pengguna melalui Supabase Auth. Pengguna otomatis diarahkan ke dashboard sesuai role-nya.

## 🚀 Cara Menjalankan di Lokal

### Prasyarat

- [Node.js](https://nodejs.org/) versi 18 ke atas
- npm (atau package manager lain)
- Akun & project [Supabase](https://supabase.com/)

### 1. Clone repository

```bash
git clone https://github.com/Rafifdev/University_Talent_Hub.git
cd University_Talent_Hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment variable

Buat file `.env` di root proyek:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 💡 Dapatkan nilai ini dari **Supabase Dashboard > Project Settings > API**.

### 4. Jalankan migrasi database

Jalankan file SQL yang ada di `supabase/migrations/` pada project Supabase kamu (lewat SQL Editor di Supabase Dashboard, atau menggunakan Supabase CLI) untuk membuat seluruh tabel (`profiles`, `skills`, `certificates`, `portfolios`, dll) beserta kebijakan keamanannya.

### 5. Jalankan mode development

```bash
npm run dev
```

### 6. Build untuk production

```bash
npm run build
```

### 7. Preview hasil build

```bash
npm run preview
```

## 📦 Script yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan aplikasi dalam mode development |
| `npm run build` | Melakukan type-check lalu build aplikasi untuk production |
| `npm run typecheck` | Mengecek tipe TypeScript tanpa build |
| `npm run preview` | Menjalankan preview hasil build secara lokal |

## 🔐 Role & Akses

Aplikasi ini menggunakan dua role utama yang disimpan pada tabel `profiles`:

- **student** — akses ke seluruh fitur di bawah `/student/*`
- **admin** — akses ke seluruh fitur manajemen & verifikasi di bawah `/admin/*`

Role ditentukan saat registrasi/pembuatan profil dan menentukan tampilan serta rute yang bisa diakses pengguna.

## ⚠️ Disclaimer

Proyek ini dibuat untuk tujuan pembelajaran/portofolio dan mensimulasikan sistem manajemen talenta mahasiswa di lingkungan universitas. Data statistik yang ditampilkan pada landing page (jumlah mahasiswa, skill terverifikasi, dll) bersifat contoh/dummy.

## 👤 Author

**Rafifdev**
GitHub: [@Rafifdev](https://github.com/Rafifdev)

---

<div align="center">
  Dibuat dengan ❤️ menggunakan React, TypeScript, Vite & Supabase
</div>
