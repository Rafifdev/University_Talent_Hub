import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Reward } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Gift, Star, Package, ShoppingBag, Ticket, Award, Lock } from 'lucide-react'

const categoryConfig: Record<string, { label: string; icon: typeof Gift; color: string; bg: string }> = {
  voucher: { label: 'Voucher', icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  merchandise: { label: 'Merchandise', icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  certificate: { label: 'Sertifikat', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  experience: { label: 'Pengalaman', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-500/10' },
  general: { label: 'Umum', icon: Gift, color: 'text-primary', bg: 'bg-primary/10' },
}

export default function StudentRewards() {
  const { profile, refreshProfile } = useAuth()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [redeemTarget, setRedeemTarget] = useState<Reward | null>(null)
  const [redeeming, setRedeeming] = useState(false)

  useEffect(() => {
    supabase
      .from('rewards')
      .select('*')
      .eq('active', true)
      .order('points_required', { ascending: true })
      .then(({ data }) => {
        setRewards(data ?? [])
        setLoading(false)
      })
  }, [])

  const handleRedeem = async () => {
    if (!redeemTarget || !profile) return
    setRedeeming(true)
    const points = profile.total_points ?? 0
    if (points < redeemTarget.points_required) {
      toast.error('Poin tidak cukup')
      setRedeeming(false)
      setRedeemTarget(null)
      return
    }
    const { error } = await supabase.from('reward_redemptions').insert({
      reward_id: redeemTarget.id,
      reward_name: redeemTarget.name,
      points_spent: redeemTarget.points_required,
      status: 'pending',
    })
    if (error) {
      toast.error('Gagal menukar reward')
    } else {
      await supabase
        .from('profiles')
        .update({ total_points: points - redeemTarget.points_required })
        .eq('id', profile.id)
      await refreshProfile()
      toast.success(`Berhasil menukar: ${redeemTarget.name}`)
    }
    setRedeeming(false)
    setRedeemTarget(null)
  }

  const userPoints = profile?.total_points ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Gift className="size-6 text-primary" /> Reward & Penukaran
          </h1>
          <p className="text-muted-foreground">Tukarkan poin Anda dengan hadiah menarik</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-amber-500/10 px-4 py-2">
          <Star className="size-5 fill-amber-500 text-amber-500" />
          <span className="font-bold text-amber-600">{userPoints.toLocaleString()} pts</span>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : rewards.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Gift className="mx-auto mb-3 size-10 opacity-30" />
          <p className="font-medium">Belum ada reward tersedia</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => {
            const cfg = categoryConfig[reward.category ?? 'general'] ?? categoryConfig.general
            const Icon = cfg.icon
            const canRedeem = userPoints >= reward.points_required
            const outOfStock = reward.remaining_quantity !== null && reward.remaining_quantity !== undefined && reward.remaining_quantity >= 0 && reward.remaining_quantity <= 0

            return (
              <Card key={reward.id} className={!canRedeem || outOfStock ? 'opacity-70' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex size-10 items-center justify-center rounded-lg ${cfg.bg}`}>
                      <Icon className={`size-5 ${cfg.color}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">{cfg.label}</Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{reward.name}</CardTitle>
                  {reward.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{reward.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 font-bold text-amber-600">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    {reward.points_required.toLocaleString()} pts
                  </div>
                  {reward.remaining_quantity !== null && reward.remaining_quantity >= 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Stok: {reward.remaining_quantity > 0
                        ? reward.remaining_quantity
                        : <span className="text-destructive">Habis</span>}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button
                    size="sm"
                    className="w-full gap-2"
                    disabled={!canRedeem || outOfStock}
                    onClick={() => setRedeemTarget(reward)}
                  >
                    {!canRedeem ? (
                      <><Lock className="size-3.5" /> Poin Kurang</>
                    ) : outOfStock ? (
                      'Stok Habis'
                    ) : (
                      <><Gift className="size-3.5" /> Tukar Sekarang</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      <AlertDialog open={!!redeemTarget} onOpenChange={(o) => !o && setRedeemTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penukaran</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menukar <strong>{redeemTarget?.name}</strong> seharga{' '}
              <strong>{redeemTarget?.points_required.toLocaleString()} poin</strong>. Sisa poin Anda:{' '}
              <strong>{(userPoints - (redeemTarget?.points_required ?? 0)).toLocaleString()} pts</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleRedeem} disabled={redeeming}>
              {redeeming ? 'Memproses...' : 'Tukar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
