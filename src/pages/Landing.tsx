import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ModeToggle } from '@/components/mode-toggle'
import {
  GraduationCap,
  Star,
  Award,
  Briefcase,
  Brain,
  Trophy,
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Rocket,
} from 'lucide-react'

const features = [
  { icon: GraduationCap, title: 'Profil Profesional', desc: 'Bangun profil lengkap dengan skill, sertifikat, dan portofolio yang terverifikasi' },
  { icon: Shield, title: 'Sistem Verifikasi', desc: 'Admin memverifikasi setiap pengajuan untuk memastikan validitas data mahasiswa' },
  { icon: Brain, title: 'AI Recommendation', desc: 'Rekomendasi cerdas untuk pengembangan karir, skill, dan sertifikasi berikutnya' },
  { icon: Trophy, title: 'Leaderboard & Reward', desc: 'Kumpulkan poin dari prestasi dan tukarkan dengan hadiah menarik' },
  { icon: Briefcase, title: 'Opportunity Board', desc: 'Temukan magang, kompetisi, beasiswa, dan peluang karir terbaik' },
  { icon: BarChart3, title: 'Dashboard Analitik', desc: 'Pantau perkembangan talenta mahasiswa dengan data yang komprehensif' },
]

const stats = [
  { value: '2,500+', label: 'Mahasiswa Aktif' },
  { value: '15,000+', label: 'Skill Terverifikasi' },
  { value: '3,200+', label: 'Sertifikat Terdaftar' },
  { value: '98%', label: 'Kepuasan Pengguna' },
]

const steps = [
  { step: '01', title: 'Daftar & Buat Profil', desc: 'Lengkapi data diri, fakultas, dan informasi akademik Anda' },
  { step: '02', title: 'Tambah Skill & Prestasi', desc: 'Input skill, unggah sertifikat, dan tambahkan portofolio terbaik Anda' },
  { step: '03', title: 'Verifikasi & Poin', desc: 'Submit untuk diverifikasi admin dan dapatkan poin reward' },
  { step: '04', title: 'Karir & Reward', desc: 'Temukan peluang karir dan tukarkan poin dengan hadiah menarik' },
]

export default function Landing() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">TalentHub Kampus</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Fitur</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Cara Kerja</a>
            <a href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Statistik</a>
          </nav>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/login">Mulai Sekarang</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <Sparkles className="size-3" />
            Platform Manajemen Talenta #1 di Kampus
          </Badge>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance md:text-6xl lg:text-7xl">
            Kelola Talenta Mahasiswa<br />
            <span className="text-primary">Secara Cerdas</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            Platform terintegrasi untuk membangun profil profesional, mendapatkan verifikasi resmi,
            dan menemukan peluang karir terbaik — didukung kecerdasan buatan.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 text-base" asChild>
              <Link to="/login">
                Mulai Gratis
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-base" asChild>
              <Link to="/login">
                <BookOpen className="size-4" />
                Lihat Demo
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {['Gratis untuk mahasiswa', 'Verifikasi resmi kampus', 'AI-powered recommendations'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-extrabold tracking-tight text-primary">{value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">Fitur Unggulan</Badge>
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight md:text-4xl">
              Semua yang Anda Butuhkan
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Dari profil hingga karir — satu platform untuk seluruh perjalanan akademik Anda
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">Cara Kerja</Badge>
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight md:text-4xl">
              Mulai dalam 4 Langkah
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-6xl font-extrabold text-primary/10">{step}</div>
                <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-4">Untuk Mahasiswa</Badge>
              <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">
                Bangun Karir dari Kampus
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Dokumentasikan setiap pencapaian akademik dan non-akademik Anda. Dapatkan verifikasi resmi
                dari kampus dan jadilah kandidat terbaik untuk peluang karir impian.
              </p>
              <ul className="mt-6 space-y-3">
                {['Profil profesional yang terverifikasi', 'Rekomendasi karir berbasis AI', 'Reward untuk setiap pencapaian', 'Akses ke 100+ peluang magang & beasiswa'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 gap-2" asChild>
                <Link to="/login">
                  <Rocket className="size-4" />
                  Daftar Sekarang
                </Link>
              </Button>
            </div>
            <div>
              <Badge variant="outline" className="mb-4">Untuk Administrator</Badge>
              <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">
                Kelola Talenta Kampus
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Dashboard komprehensif untuk memantau, memverifikasi, dan mengelola data talenta
                seluruh mahasiswa. Temukan mahasiswa berbakat dengan AI Talent Search.
              </p>
              <ul className="mt-6 space-y-3">
                {['Dashboard statistik real-time', 'Workflow verifikasi yang efisien', 'AI Talent Search canggih', 'Manajemen reward & opportunity'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 gap-2" variant="outline" asChild>
                <Link to="/login">
                  <Users className="size-4" />
                  Login Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Star className="mx-auto mb-4 size-10 opacity-80" />
          <h2 className="scroll-m-20 text-3xl font-bold tracking-tight md:text-4xl">
            Siap Memulai Perjalanan Anda?
          </h2>
          <p className="mt-4 text-lg opacity-80">
            Bergabunglah dengan ribuan mahasiswa yang telah membangun profil profesional mereka
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link to="/login">
                Mulai Sekarang — Gratis
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm opacity-60">
            Tidak perlu kartu kredit. Gratis untuk mahasiswa.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex size-6 items-center justify-center rounded bg-primary">
            <GraduationCap className="size-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">TalentHub Kampus</span>
        </div>
        <p>© {new Date().getFullYear()} TalentHub Kampus. Platform Manajemen Talenta Mahasiswa.</p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <Award className="size-4" />
          <span>Powered by AI</span>
        </div>
      </footer>
    </div>
  )
}
