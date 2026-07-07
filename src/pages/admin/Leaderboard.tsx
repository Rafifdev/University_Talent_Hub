import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Star, Crown, Medal } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  full_name: string
  student_id: string
  major: string
  total_points: number
  rank?: number
}

const medalConfig = [
  { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10' },
]

export default function AdminLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name, student_id, major, total_points')
      .eq('role', 'student')
      .order('total_points', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setEntries((data ?? []).map((e, i) => ({ ...e, rank: i + 1 })))
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Trophy className="size-6 text-amber-500" /> Leaderboard Mahasiswa
        </h1>
        <p className="text-muted-foreground">Peringkat mahasiswa berdasarkan total poin yang dikumpulkan</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(10)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : entries.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Trophy className="mx-auto mb-3 size-10 opacity-30" />
          <p className="font-medium">Belum ada mahasiswa terdaftar</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {entries.map((entry, i) => {
              const medalCfg = i < 3 ? medalConfig[i] : null
              const Icon = medalCfg?.icon
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 px-6 py-4 border-b last:border-0 hover:bg-muted/30 transition-colors ${i === 0 ? 'bg-yellow-500/5' : ''}`}
                >
                  <div className="w-10 shrink-0 flex items-center justify-center">
                    {medalCfg && Icon ? (
                      <div className={`flex size-8 items-center justify-center rounded-full ${medalCfg.bg}`}>
                        <Icon className={`size-4 ${medalCfg.color}`} />
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">#{entry.rank}</span>
                    )}
                  </div>
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="text-sm font-semibold">
                      {entry.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{entry.full_name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      {entry.student_id && <span>{entry.student_id}</span>}
                      {entry.major && <span className="truncate">· {entry.major}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 shrink-0">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    {(entry.total_points ?? 0).toLocaleString()} pts
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
