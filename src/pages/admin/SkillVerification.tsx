import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Zap, CheckCircle2, XCircle, Search, User } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface SubmissionWithProfile {
  id: string
  reference_id: string
  reference_name: string
  type: string
  status: string
  notes: string | null
  created_at: string
  profiles: { full_name: string; student_id: string } | null
}

export default function AdminSkillVerification() {
  const [subs, setSubs] = useState<SubmissionWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('waiting')
  const [search, setSearch] = useState('')
  const [actionTarget, setActionTarget] = useState<SubmissionWithProfile | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const [rejectionReason, setRejectionReason] = useState('')
  const [pointsAwarded, setPointsAwarded] = useState('10')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    supabase
      .from('submissions')
      .select('*, profiles(full_name, student_id)')
      .eq('type', 'skill')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSubs((data as SubmissionWithProfile[]) ?? [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const filtered = subs.filter((s) => {
    const matchFilter = filter === 'all' || s.status === filter
    const matchSearch = s.reference_name.toLowerCase().includes(search.toLowerCase()) ||
      s.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || false
    return matchFilter && matchSearch
  })

  const handleAction = async () => {
    if (!actionTarget) return
    setSubmitting(true)
    if (actionType === 'approve') {
      const pts = parseInt(pointsAwarded) || 0
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'approved', points_awarded: pts, updated_at: new Date().toISOString() })
        .eq('id', actionTarget.id)
      if (!error && pts > 0) {
        await supabase
          .from('profiles')
          .select('id, total_points')
          .eq('id', actionTarget.profiles ? (actionTarget as any).user_id : null)
          .maybeSingle()
        await supabase.from('skills')
          .update({ verified: true })
          .eq('id', actionTarget.reference_id)
      }
      if (error) toast.error('Gagal menyetujui')
      else toast.success('Pengajuan disetujui')
    } else {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'rejected', rejection_reason: rejectionReason, updated_at: new Date().toISOString() })
        .eq('id', actionTarget.id)
      if (error) toast.error('Gagal menolak')
      else toast.success('Pengajuan ditolak')
    }
    setSubmitting(false)
    setActionTarget(null)
    setRejectionReason('')
    load()
  }

  const openApprove = (sub: SubmissionWithProfile) => {
    setActionTarget(sub)
    setActionType('approve')
    setPointsAwarded('10')
  }

  const openReject = (sub: SubmissionWithProfile) => {
    setActionTarget(sub)
    setActionType('reject')
    setRejectionReason('')
  }

  const counts = {
    all: subs.length,
    waiting: subs.filter((s) => s.status === 'waiting').length,
    approved: subs.filter((s) => s.status === 'approved').length,
    rejected: subs.filter((s) => s.status === 'rejected').length,
  }

  const statusConfig = {
    waiting: { label: 'Menunggu', variant: 'secondary' as const },
    approved: { label: 'Disetujui', variant: 'default' as const },
    rejected: { label: 'Ditolak', variant: 'destructive' as const },
    draft: { label: 'Draft', variant: 'outline' as const },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Zap className="size-6 text-primary" /> Verifikasi Skill
        </h1>
        <p className="text-muted-foreground">Review dan verifikasi pengajuan skill mahasiswa</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari nama skill atau mahasiswa..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'waiting', label: `Menunggu (${counts.waiting})` },
            { key: 'approved', label: `Disetujui (${counts.approved})` },
            { key: 'rejected', label: `Ditolak (${counts.rejected})` },
            { key: 'all', label: `Semua (${counts.all})` },
          ].map(({ key, label }) => (
            <Button key={key} variant={filter === key ? 'default' : 'outline'} size="sm" onClick={() => setFilter(key)}>
              {label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Zap className="mx-auto mb-3 size-10 opacity-30" />
          <p className="font-medium">Tidak ada pengajuan skill</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            const sc = statusConfig[sub.status as keyof typeof statusConfig] ?? statusConfig.draft
            return (
              <Card key={sub.id}>
                <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{sub.reference_name}</p>
                      <Badge variant={sc.variant} className="text-xs">{sc.label}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="size-3.5" />
                      <span>{sub.profiles?.full_name ?? 'Unknown'}</span>
                      {sub.profiles?.student_id && <span>· {sub.profiles.student_id}</span>}
                      <span>· {format(new Date(sub.created_at), 'dd MMM yyyy', { locale: idLocale })}</span>
                    </div>
                    {sub.notes && <p className="mt-1 text-sm text-muted-foreground">{sub.notes}</p>}
                  </div>
                  {sub.status === 'waiting' && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" onClick={() => openApprove(sub)} className="gap-1">
                        <CheckCircle2 className="size-3.5" /> Setujui
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => openReject(sub)} className="gap-1">
                        <XCircle className="size-3.5" /> Tolak
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={!!actionTarget} onOpenChange={(o) => !o && setActionTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === 'approve' ? 'Setujui Pengajuan Skill' : 'Tolak Pengajuan Skill'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Skill: <strong>{actionTarget?.reference_name}</strong> dari <strong>{actionTarget?.profiles?.full_name}</strong>
            </p>
            {actionType === 'approve' ? (
              <div className="space-y-2">
                <Label>Poin Diberikan</Label>
                <Input type="number" value={pointsAwarded} onChange={(e) => setPointsAwarded(e.target.value)} min={0} max={100} />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Alasan Penolakan</Label>
                <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Jelaskan alasan penolakan..." className="resize-none" rows={3} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionTarget(null)}>Batal</Button>
            <Button onClick={handleAction} disabled={submitting} variant={actionType === 'reject' ? 'destructive' : 'default'}>
              {submitting ? 'Memproses...' : actionType === 'approve' ? 'Setujui' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
