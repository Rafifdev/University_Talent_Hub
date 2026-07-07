import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Briefcase, Plus, Pencil, Trash2, MapPin, Calendar, Loader2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const typeLabels = {
  internship: 'Magang', competition: 'Kompetisi', scholarship: 'Beasiswa',
  event: 'Event', research: 'Penelitian',
}

export default function AdminOpportunityManagement() {
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<Opportunity | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', company: '', location: '', type: 'internship' as Opportunity['type'],
    deadline: '', link: '', requirements_str: '', active: true,
  })

  const load = () => {
    supabase.from('opportunities').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setOpps(data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditItem(null)
    setForm({ title: '', description: '', company: '', location: '', type: 'internship', deadline: '', link: '', requirements_str: '', active: true })
    setDialogOpen(true)
  }

  const openEdit = (o: Opportunity) => {
    setEditItem(o)
    setForm({
      title: o.title, description: o.description ?? '', company: o.company ?? '', location: o.location ?? '',
      type: o.type, deadline: o.deadline ?? '', link: o.link ?? '',
      requirements_str: o.requirements.join(', '), active: o.active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Judul wajib diisi'); return }
    setSubmitting(true)
    const payload = {
      title: form.title, description: form.description || null,
      company: form.company || null, location: form.location || null,
      type: form.type, deadline: form.deadline || null, link: form.link || null,
      requirements: form.requirements_str ? form.requirements_str.split(',').map((r) => r.trim()).filter(Boolean) : [],
      active: form.active, updated_at: new Date().toISOString(),
    }
    if (editItem) {
      const { error } = await supabase.from('opportunities').update(payload).eq('id', editItem.id)
      if (error) toast.error('Gagal mengupdate peluang')
      else toast.success('Peluang diperbarui')
    } else {
      const { error } = await supabase.from('opportunities').insert({ ...payload, updated_at: undefined })
      if (error) toast.error('Gagal menambahkan peluang')
      else toast.success('Peluang ditambahkan')
    }
    setSubmitting(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('opportunities').delete().eq('id', deleteId)
    if (error) toast.error('Gagal menghapus peluang')
    else { toast.success('Peluang dihapus'); load() }
    setDeleteId(null)
  }

  const typeConfig = {
    internship: { label: 'Magang', variant: 'default' as const },
    competition: { label: 'Kompetisi', variant: 'secondary' as const },
    scholarship: { label: 'Beasiswa', variant: 'outline' as const },
    event: { label: 'Event', variant: 'secondary' as const },
    research: { label: 'Penelitian', variant: 'outline' as const },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Briefcase className="size-6 text-primary" /> Kelola Peluang
          </h1>
          <p className="text-muted-foreground">Kelola magang, kompetisi, beasiswa, dan peluang lainnya</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="size-4" /> Tambah Peluang</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : opps.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Briefcase className="mx-auto mb-3 size-10 opacity-30" />
          <p className="font-medium">Belum ada peluang</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {opps.map((opp) => {
            const tc = typeConfig[opp.type] ?? typeConfig.internship
            return (
              <Card key={opp.id} className={!opp.active ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={tc.variant}>{tc.label}</Badge>
                    <Badge variant={opp.active ? 'default' : 'secondary'} className="text-xs">{opp.active ? 'Aktif' : 'Nonaktif'}</Badge>
                  </div>
                  <CardTitle className="text-base mt-2 line-clamp-1">{opp.title}</CardTitle>
                  {opp.company && <p className="text-sm text-muted-foreground">{opp.company}</p>}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {opp.location && (
                      <div className="flex items-center gap-1.5"><MapPin className="size-3.5" />{opp.location}</div>
                    )}
                    {opp.deadline && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        Deadline: {format(new Date(opp.deadline), 'dd MMM yyyy', { locale: idLocale })}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => openEdit(opp)} className="gap-1">
                      <Pencil className="size-3" /> Edit
                    </Button>
                    {opp.link && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={opp.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-3" /></a>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(opp.id)} className="text-destructive hover:text-destructive ml-auto">
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Peluang' : 'Tambah Peluang Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipe</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Opportunity['type'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Perusahaan / Penyelenggara</Label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lokasi</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote / Kota" />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="resize-none" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Persyaratan (pisah koma)</Label>
              <Input value={form.requirements_str} onChange={(e) => setForm({ ...form, requirements_str: e.target.value })} placeholder="React, Node.js, ..." />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {editItem ? 'Simpan' : 'Tambahkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Peluang?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
