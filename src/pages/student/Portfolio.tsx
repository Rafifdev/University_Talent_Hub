import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Portfolio } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { toast } from 'sonner'
import { Plus, FolderOpen, Pencil, Trash2, CheckCircle2, Loader2, Send, ExternalLink, GitBranch } from 'lucide-react'

const typeLabels = { project: 'Proyek', design: 'Desain', research: 'Penelitian', other: 'Lainnya' }
const typeColors = { project: 'default', design: 'secondary', research: 'outline', other: 'outline' } as const

export default function StudentPortfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editItem, setEditItem] = useState<Portfolio | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', project_url: '', repo_url: '',
    tech_stack_str: '', type: 'project' as Portfolio['type'],
  })

  const load = async () => {
    const { data } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false })
    setPortfolios(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditItem(null)
    setForm({ title: '', description: '', project_url: '', repo_url: '', tech_stack_str: '', type: 'project' })
    setDialogOpen(true)
  }

  const openEdit = (p: Portfolio) => {
    setEditItem(p)
    setForm({
      title: p.title, description: p.description ?? '', project_url: p.project_url ?? '',
      repo_url: p.repo_url ?? '', tech_stack_str: p.tech_stack.join(', '), type: p.type,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Judul wajib diisi'); return }
    setSubmitting(true)
    const payload = {
      title: form.title, description: form.description || null,
      project_url: form.project_url || null, repo_url: form.repo_url || null,
      tech_stack: form.tech_stack_str ? form.tech_stack_str.split(',').map((t) => t.trim()).filter(Boolean) : [],
      type: form.type, updated_at: new Date().toISOString(),
    }
    if (editItem) {
      const { error } = await supabase.from('portfolios').update(payload).eq('id', editItem.id)
      if (error) toast.error('Gagal mengupdate portofolio')
      else toast.success('Portofolio diperbarui')
    } else {
      const { error } = await supabase.from('portfolios').insert({ ...payload, updated_at: undefined })
      if (error) toast.error('Gagal menambahkan portofolio')
      else toast.success('Portofolio ditambahkan')
    }
    setSubmitting(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('portfolios').delete().eq('id', deleteId)
    if (error) toast.error('Gagal menghapus portofolio')
    else { toast.success('Portofolio dihapus'); load() }
    setDeleteId(null)
  }

  const handleSubmitVerification = async (p: Portfolio) => {
    const { error } = await supabase.from('submissions').insert({
      type: 'portfolio', reference_id: p.id, reference_name: p.title, status: 'waiting',
    })
    if (error) toast.error('Gagal mengajukan verifikasi')
    else toast.success('Verifikasi diajukan!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portofolio</h1>
          <p className="text-muted-foreground">Tampilkan karya dan proyek terbaik Anda</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="size-4" /> Tambah Proyek</Button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-xl border bg-muted/30 animate-pulse" />)}
        </div>
      ) : portfolios.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><FolderOpen /></EmptyMedia>
            <EmptyTitle>Portofolio kosong</EmptyTitle>
            <EmptyDescription>Tambahkan proyek atau karya Anda untuk ditampilkan</EmptyDescription>
          </EmptyHeader>
          <Button onClick={openAdd} className="gap-2"><Plus className="size-4" />Tambah Proyek</Button>
        </Empty>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={typeColors[p.type]}>{typeLabels[p.type]}</Badge>
                  {p.verified && <CheckCircle2 className="size-5 shrink-0 text-green-500" />}
                </div>
                <CardTitle className="text-base mt-2">{p.title}</CardTitle>
                {p.description && <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                {p.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.tech_stack.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs px-1.5 py-0">{t}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2 flex-wrap border-t pt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="gap-1">
                  <Pencil className="size-3" /> Edit
                </Button>
                {!p.verified && (
                  <Button size="sm" variant="outline" onClick={() => handleSubmitVerification(p)} className="gap-1">
                    <Send className="size-3" /> Ajukan
                  </Button>
                )}
                {p.project_url && (
                  <Button size="sm" variant="ghost" asChild className="gap-1">
                    <a href={p.project_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-3" /></a>
                  </Button>
                )}
                {p.repo_url && (
                  <Button size="sm" variant="ghost" asChild className="gap-1">
                    <a href={p.repo_url} target="_blank" rel="noopener noreferrer"><GitBranch className="size-3" /></a>
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="text-destructive hover:text-destructive ml-auto">
                  <Trash2 className="size-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Portofolio' : 'Tambah Portofolio Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Judul Proyek *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nama proyek Anda" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Deskripsi</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi proyek..." className="resize-none" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Tipe</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Portfolio['type'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tech Stack (pisah koma)</Label>
                <Input value={form.tech_stack_str} onChange={(e) => setForm({ ...form, tech_stack_str: e.target.value })} placeholder="React, Node.js, ..." />
              </div>
              <div className="space-y-2">
                <Label>URL Proyek</Label>
                <Input value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>URL Repository</Label>
                <Input value={form.repo_url} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} placeholder="https://github.com/..." />
              </div>
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
            <AlertDialogTitle>Hapus Portofolio?</AlertDialogTitle>
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
