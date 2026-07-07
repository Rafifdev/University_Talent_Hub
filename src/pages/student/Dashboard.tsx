import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Zap, Award, FolderOpen, ClipboardList, Star, Trophy,
  ArrowRight, CheckCircle2, Clock, XCircle,
  Briefcase, Brain,
} from 'lucide-react'

interface Stats {
  skills: number
  certificates: number
  portfolios: number
  pendingSubmissions: number
  approvedSubmissions: number
  rejectedSubmissions: number
  totalPoints: number
}

export default function StudentDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [skills, certs, portfolios, submissions] = await Promise.all([
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('certificates').select('id', { count: 'exact', head: true }),
        supabase.from('portfolios').select('id', { count: 'exact', head: true }),
        supabase.from('submissions').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      const allSubs = await supabase.from('submissions').select('status')
      const subList = allSubs.data ?? []

      setStats({
        skills: skills.count ?? 0,
        certificates: certs.count ?? 0,
        portfolios: portfolios.count ?? 0,
        pendingSubmissions: subList.filter((s) => s.status === 'waiting').length,
        approvedSubmissions: subList.filter((s) => s.status === 'approved').length,
        rejectedSubmissions: subList.filter((s) => s.status === 'rejected').length,
        totalPoints: profile?.total_points ?? 0,
      })
      setRecentSubmissions(submissions.data ?? [])
      setLoading(false)
    }
    load()
  }, [profile])

  const profileCompletion = (() => {
    if (!profile) return 0
    const fields = [profile.full_name, profile.student_id, profile.faculty, profile.major, profile.bio, profile.phone]
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  })()

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    )
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      waiting: { label: 'Menunggu', variant: 'secondary' },
      approved: { label: 'Disetujui', variant: 'default' },
      rejected: { label: 'Ditolak', variant: 'destructive' },
      draft: { label: 'Draft', variant: 'outline' },
    }
    const cfg = map[status] ?? { label: status, variant: 'outline' as const }
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Halo, {profile?.full_name?.split(' ')[0] ?? 'Mahasiswa'} 👋
        </h1>
        <p className="text-muted-foreground">Pantau perkembangan profil dan aktivitas talenta Anda</p>
      </div>

      {/* Profile completion */}
      {profileCompletion < 100 && (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">Lengkapi Profil Anda</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Profil lengkap meningkatkan peluang ditemukan oleh rekruter
                </p>
                <Progress value={profileCompletion} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-1">{profileCompletion}% selesai</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link to="/student/profile">Lengkapi</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Skill</CardTitle>
            <Zap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.skills}</div>
            <Link to="/student/skills" className="text-xs text-primary hover:underline">
              Kelola skill →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sertifikat</CardTitle>
            <Award className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.certificates}</div>
            <Link to="/student/certificates" className="text-xs text-primary hover:underline">
              Kelola sertifikat →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Portofolio</CardTitle>
            <FolderOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.portfolios}</div>
            <Link to="/student/portfolio" className="text-xs text-primary hover:underline">
              Kelola portofolio →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Poin</CardTitle>
            <Star className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPoints}</div>
            <Link to="/student/rewards" className="text-xs text-primary hover:underline">
              Tukar reward →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Submission status */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="size-5 text-amber-500" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats?.pendingSubmissions}</div>
                <div className="text-xs text-muted-foreground">Menunggu Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="size-5 text-green-500" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats?.approvedSubmissions}</div>
                <div className="text-xs text-muted-foreground">Disetujui</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="size-5 text-destructive" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats?.rejectedSubmissions}</div>
                <div className="text-xs text-muted-foreground">Ditolak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: '/student/skills', icon: Zap, label: 'Tambah Skill', desc: 'Daftarkan skill baru' },
          { to: '/student/ai-recommendation', icon: Brain, label: 'AI Rekomendasi', desc: 'Saran karir cerdas' },
          { to: '/student/opportunities', icon: Briefcase, label: 'Peluang Karir', desc: 'Magang & kompetisi' },
          { to: '/student/leaderboard', icon: Trophy, label: 'Leaderboard', desc: 'Posisi Anda' },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Card key={to} className="transition-shadow hover:shadow-md">
            <CardContent className="pt-4">
              <Link to={to} className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                <ArrowRight className="ml-auto size-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent submissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pengajuan Terbaru</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/student/submissions">Lihat semua <ArrowRight className="ml-1 size-3" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <ClipboardList className="mx-auto mb-2 size-8 opacity-30" />
              Belum ada pengajuan. <Link to="/student/skills" className="text-primary hover:underline">Tambahkan skill</Link> untuk diverifikasi.
            </div>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="text-sm font-medium">{sub.reference_name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{sub.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.status === 'approved' && (
                      <span className="text-xs text-green-600 font-medium">+{sub.points_awarded} pts</span>
                    )}
                    {statusBadge(sub.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
