import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, CheckCircle2, Clock, Trophy, Briefcase, Star, TrendingUp, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Stats {
  totalStudents: number
  totalSubmissions: number
  pendingSubmissions: number
  approvedSubmissions: number
  totalOpportunities: number
  totalRewards: number
}

interface RecentSubmission {
  id: string
  reference_name: string
  type: string
  status: string
  created_at: string
  profiles: { full_name: string } | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentSubs, setRecentSubs] = useState<RecentSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('submissions').select('id', { count: 'exact', head: true }),
      supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'waiting'),
      supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('rewards').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('submissions').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(8),
    ]).then(([students, subs, pending, approved, opps, rewards, recent]) => {
      setStats({
        totalStudents: students.count ?? 0,
        totalSubmissions: subs.count ?? 0,
        pendingSubmissions: pending.count ?? 0,
        approvedSubmissions: approved.count ?? 0,
        totalOpportunities: opps.count ?? 0,
        totalRewards: rewards.count ?? 0,
      })
      setRecentSubs((recent.data as RecentSubmission[]) ?? [])
      setLoading(false)
    })
  }, [])

  const statCards = stats ? [
    { label: 'Total Mahasiswa', value: stats.totalStudents, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Menunggu Review', value: stats.pendingSubmissions, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/admin/skill-verification' },
    { label: 'Disetujui', value: stats.approvedSubmissions, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Pengajuan', value: stats.totalSubmissions, icon: ClipboardList, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Peluang Aktif', value: stats.totalOpportunities, icon: Briefcase, color: 'text-cyan-500', bg: 'bg-cyan-500/10', href: '/admin/opportunity-management' },
    { label: 'Reward Aktif', value: stats.totalRewards, icon: Star, color: 'text-rose-500', bg: 'bg-rose-500/10', href: '/admin/reward-management' },
  ] : []

  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    waiting: { label: 'Menunggu', variant: 'secondary' },
    approved: { label: 'Disetujui', variant: 'default' },
    rejected: { label: 'Ditolak', variant: 'destructive' },
    draft: { label: 'Draft', variant: 'outline' },
  }

  const typeLabels: Record<string, string> = { skill: 'Skill', certificate: 'Sertifikat', portfolio: 'Portofolio' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas dan statistik platform TalentHub</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map(({ label, value, icon: Icon, color, bg, href }) => (
            <Card key={label} className={href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}>
              <CardContent className="flex items-center gap-4 pt-6 pb-4">
                <div className={`flex size-12 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`size-6 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
                {href && (
                  <Link to={href} className="ml-auto text-xs text-primary hover:underline">Lihat</Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="size-4" /> Pengajuan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              [...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)
            ) : recentSubs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Belum ada pengajuan</p>
            ) : (
              recentSubs.map((sub) => {
                const sc = statusConfig[sub.status] ?? statusConfig.draft
                return (
                  <div key={sub.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{sub.reference_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.profiles?.full_name ?? 'Unknown'} · {typeLabels[sub.type] ?? sub.type}
                      </p>
                    </div>
                    <Badge variant={sc.variant} className="shrink-0 text-xs">{sc.label}</Badge>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4" /> Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { to: '/admin/skill-verification', label: 'Verifikasi Skill', icon: Trophy, color: 'bg-blue-500/10 text-blue-600' },
              { to: '/admin/certificate-verification', label: 'Verifikasi Sertifikat', icon: CheckCircle2, color: 'bg-amber-500/10 text-amber-600' },
              { to: '/admin/portfolio-verification', label: 'Verifikasi Portofolio', icon: ClipboardList, color: 'bg-purple-500/10 text-purple-600' },
              { to: '/admin/students', label: 'Data Mahasiswa', icon: Users, color: 'bg-green-500/10 text-green-600' },
              { to: '/admin/reward-management', label: 'Kelola Reward', icon: Star, color: 'bg-rose-500/10 text-rose-600' },
              { to: '/admin/opportunity-management', label: 'Kelola Peluang', icon: Briefcase, color: 'bg-cyan-500/10 text-cyan-600' },
            ].map(({ to, label, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-lg p-3 text-sm font-medium transition-opacity hover:opacity-80 ${color}`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="leading-tight">{label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
