import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Medal, Star, Crown } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  full_name: string
  student_id: string
  major: string
  total_points: number
  rank?: number
}

const medalConfig = [
  { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: '1st' },
  { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-400/10', label: '2nd' },
  { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10', label: '3rd' },
]

export default function StudentLeaderboard() {
  const { profile } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name, student_id, major, total_points')
      .order('total_points', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setEntries((data ?? []).map((e, i) => ({ ...e, rank: i + 1 })))
        setLoading(false)
      })
  }, [])

  const myEntry = entries.find((e) => e.id === profile?.id)
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Trophy className="size-6 text-amber-500" /> Leaderboard
        </h1>
        <p className="text-muted-foreground">Peringkat mahasiswa berdasarkan total poin yang dikumpulkan</p>
      </div>

      {myEntry && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 pt-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              #{myEntry.rank}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{myEntry.full_name ?? 'Anda'}</p>
              <p className="text-sm text-muted-foreground">{myEntry.major}</p>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-amber-600">
              <Star className="size-4 fill-amber-500 text-amber-500" />
              {myEntry.total_points.toLocaleString()} pts
            </div>
            <Badge variant="outline">Posisi Anda</Badge>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : (
        <>
          {top3.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {top3.map((entry, i) => {
                const cfg = medalConfig[i]
                const Icon = cfg.icon
                return (
                  <Card key={entry.id} className={i === 0 ? 'border-yellow-500/30' : ''}>
                    <CardContent className="flex flex-col items-center gap-3 pt-6 pb-4 text-center">
                      <div className={`flex size-12 items-center justify-center rounded-full ${cfg.bg}`}>
                        <Icon className={`size-6 ${cfg.color}`} />
                      </div>
                      <Avatar className="size-14">
                        <AvatarFallback className="text-lg font-bold">
                          {entry.full_name?.charAt(0) ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold line-clamp-1">{entry.full_name}</p>
                        <p className="text-xs text-muted-foreground">{entry.major}</p>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        {entry.total_points.toLocaleString()} pts
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {rest.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Peringkat 4 - {entries.length}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-0">
                {rest.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 px-6 py-3 hover:bg-muted/50 transition-colors ${entry.id === profile?.id ? 'bg-primary/5' : ''}`}
                  >
                    <span className="w-8 text-center text-sm font-medium text-muted-foreground">#{entry.rank}</span>
                    <Avatar className="size-8">
                      <AvatarFallback className="text-sm">{entry.full_name?.charAt(0) ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{entry.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{entry.major}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-600 shrink-0">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      {entry.total_points.toLocaleString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
