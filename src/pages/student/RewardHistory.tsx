import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { History, Star, Clock, CheckCircle2, XCircle, Package } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface RedemptionWithReward {
  id: string
  points_spent: number
  status: string
  reward_name: string
  created_at: string
  rewards: { name: string } | null
}

const statusConfig = {
  pending: { label: 'Menunggu', variant: 'secondary' as const, icon: Clock, color: 'text-amber-600' },
  processing: { label: 'Diproses', variant: 'default' as const, icon: CheckCircle2, color: 'text-blue-600' },
  fulfilled: { label: 'Selesai', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
  cancelled: { label: 'Dibatalkan', variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' },
}

export default function StudentRewardHistory() {
  const [history, setHistory] = useState<RedemptionWithReward[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('reward_redemptions')
      .select('*, rewards(name, type)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setHistory((data as RedemptionWithReward[]) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <History className="size-6 text-primary" /> Riwayat Penukaran
        </h1>
        <p className="text-muted-foreground">Histori penukaran reward Anda</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : history.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Package /></EmptyMedia>
            <EmptyTitle>Belum ada riwayat penukaran</EmptyTitle>
            <EmptyDescription>Tukar poin Anda dengan reward di halaman Reward</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const cfg = statusConfig[item.status as keyof typeof statusConfig] ?? statusConfig.pending
            const Icon = cfg.icon
            return (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between gap-4 pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`mt-0.5 ${cfg.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">{item.reward_name || item.rewards?.name || 'Reward'}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      -{item.points_spent.toLocaleString()} pts
                    </span>
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
