import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Search, Star, GraduationCap } from 'lucide-react'
import type { Profile } from '@/types'

export default function AdminStudents() {
  const [students, setStudents] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('total_points', { ascending: false })
      .then(({ data }) => {
        setStudents(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.full_name?.toLowerCase().includes(q) ||
      s.student_id?.toLowerCase().includes(q) ||
      s.major?.toLowerCase().includes(q) ||
      false
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Users className="size-6" /> Data Mahasiswa
        </h1>
        <p className="text-muted-foreground">Daftar semua mahasiswa yang terdaftar di TalentHub</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama, NIM, atau jurusan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Users className="mx-auto mb-3 size-10 opacity-30" />
          <p className="font-medium">Tidak ada mahasiswa ditemukan</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{filtered.length} mahasiswa ditemukan</p>
          {filtered.map((student, i) => (
            <Card key={student.id}>
              <CardContent className="flex items-center gap-4 pt-4 pb-4">
                <div className="flex size-8 w-8 shrink-0 items-center justify-center text-sm font-medium text-muted-foreground">
                  {i + 1}
                </div>
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className="font-semibold">
                    {student.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{student.full_name ?? 'Unnamed'}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                    {student.student_id && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <GraduationCap className="size-3" /> {student.student_id}
                      </span>
                    )}
                    {student.major && (
                      <span className="text-xs text-muted-foreground">{student.major}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 font-semibold text-amber-600">
                    <Star className="size-3.5 fill-amber-500 text-amber-500" />
                    {(student.total_points ?? 0).toLocaleString()} pts
                  </div>
                  <Badge variant="outline" className="text-xs">Mahasiswa</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
