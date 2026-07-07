import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Submission } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'
import { ClipboardList, Clock, CheckCircle2, XCircle, Star, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const statusConfig = {
  draft: { label: 'Draft', variant: 'outline' as const, icon: Clock, color: 'text-muted-foreground' },
  waiting: { label: 'Menunggu Review', variant: 'secondary' as const, icon: Clock, color: 'text-amber-600' },
  approved: { label: 'Disetujui', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
  rejected: { label: 'Ditolak', variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' },
}

const typeLabels = { skill: 'Skill', certificate: 'Sertifikat', portfolio: 'Portofolio' }

export default function StudentSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    supabase.from('submissions').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setSubmissions(data ?? [])
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter)

  const counts = {
    all: submissions.length,
    waiting: submissions.filter((s) => s.status === 'waiting').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Verifikasi</h1>
        <p className="text-muted-foreground">Pantau status verifikasi skill, sertifikat, dan portofolio Anda</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: `Semua (${counts.all})` },
          { key: 'waiting', label: `Menunggu (${counts.waiting})` },
          { key: 'approved', label: `Disetujui (${counts.approved})` },
          { key: 'rejected', label: `Ditolak (${counts.rejected})` },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><ClipboardList /></EmptyMedia>
            <EmptyTitle>Tidak ada pengajuan</EmptyTitle>
            <EmptyDescription>
              {filter === 'all'
                ? 'Ajukan verifikasi dari halaman Skill, Sertifikat, atau Portofolio'
                : `Tidak ada pengajuan dengan status "${filter}"`}
            </EmptyDescription>
          </EmptyHeader>
          {filter === 'all' && (
            <Button asChild><Link to="/student/skills">Tambah Skill</Link></Button>
          )}
        </Empty>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            const cfg = statusConfig[sub.status]
            const Icon = cfg.icon
            return (
              <Card key={sub.id}>
                <CardContent className="flex items-start justify-between gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${cfg.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="font-medium">{sub.reference_name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{typeLabels[sub.type]}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="size-3" />
                          {format(new Date(sub.created_at), 'dd MMM yyyy', { locale: idLocale })}
                        </span>
                      </div>
                      {sub.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{sub.notes}</p>
                      )}
                      {sub.rejection_reason && (
                        <div className="mt-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                          <strong>Alasan penolakan:</strong> {sub.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    {sub.status === 'approved' && sub.points_awarded > 0 && (
                      <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        +{sub.points_awarded} pts
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
