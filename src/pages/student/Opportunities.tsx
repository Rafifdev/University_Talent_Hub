import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Briefcase, Calendar, MapPin, Search, ExternalLink, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const typeConfig = {
  internship: { label: 'Magang', variant: 'default' as const },
  competition: { label: 'Kompetisi', variant: 'secondary' as const },
  scholarship: { label: 'Beasiswa', variant: 'outline' as const },
  event: { label: 'Event', variant: 'secondary' as const },
  research: { label: 'Penelitian', variant: 'outline' as const },
}

export default function StudentOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [applied, setApplied] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    Promise.all([
      supabase.from('opportunities').select('*').eq('active', true).order('created_at', { ascending: false }),
      supabase.from('opportunity_applications').select('opportunity_id'),
    ]).then(([ops, apps]) => {
      setOpportunities(ops.data ?? [])
      setApplied(new Set(apps.data?.map((a) => a.opportunity_id) ?? []))
      setLoading(false)
    })
  }, [])

  const handleApply = async (opp: Opportunity) => {
    const { error } = await supabase.from('opportunity_applications').insert({ opportunity_id: opp.id })
    if (error) {
      toast.error('Gagal mendaftar')
    } else {
      setApplied((prev) => new Set([...prev, opp.id]))
      toast.success('Berhasil mendaftar ke ' + opp.title)
    }
  }

  const filtered = opportunities.filter((o) => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.company?.toLowerCase().includes(search.toLowerCase()) || false
    const matchType = typeFilter === 'all' || o.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Peluang & Kesempatan</h1>
        <p className="text-muted-foreground">Temukan magang, kompetisi, beasiswa, dan peluang lainnya</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari peluang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'internship', 'competition', 'scholarship', 'event', 'research'].map((t) => (
            <Button
              key={t}
              variant={typeFilter === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(t)}
            >
              {t === 'all' ? 'Semua' : typeConfig[t as keyof typeof typeConfig]?.label ?? t}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-xl border bg-muted/30 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Briefcase className="mx-auto mb-3 size-10 opacity-30" />
          <p className="font-medium">Tidak ada peluang ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter pencarian</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((opp) => (
            <Card key={opp.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={typeConfig[opp.type].variant}>{typeConfig[opp.type].label}</Badge>
                  {applied.has(opp.id) && <CheckCircle2 className="size-5 text-green-500 shrink-0" />}
                </div>
                <CardTitle className="text-base mt-2 line-clamp-2">{opp.title}</CardTitle>
                {opp.company && <p className="text-sm font-medium text-muted-foreground">{opp.company}</p>}
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {opp.description && <p className="text-sm text-muted-foreground line-clamp-3">{opp.description}</p>}
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {opp.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {opp.location}
                    </div>
                  )}
                  {opp.deadline && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Deadline: {format(new Date(opp.deadline), 'dd MMM yyyy', { locale: idLocale })}
                    </div>
                  )}
                </div>
                {opp.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {opp.requirements.slice(0, 3).map((r) => (
                      <Badge key={r} variant="outline" className="text-xs px-1.5 py-0">{r}</Badge>
                    ))}
                    {opp.requirements.length > 3 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">+{opp.requirements.length - 3}</Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2 border-t pt-3">
                {applied.has(opp.id) ? (
                  <Button size="sm" variant="secondary" className="gap-1 flex-1" disabled>
                    <CheckCircle2 className="size-3.5" /> Sudah Daftar
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1" onClick={() => handleApply(opp)}>
                    Daftar Sekarang
                  </Button>
                )}
                {opp.link && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={opp.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
