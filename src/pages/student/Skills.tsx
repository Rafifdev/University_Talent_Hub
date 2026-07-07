import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Skill } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { toast } from 'sonner'
import { Plus, Zap, Pencil, Trash2, CheckCircle2, Loader2, Send } from 'lucide-react'

const categories = ['Programming', 'Design', 'Data Science', 'DevOps', 'Mobile', 'Database', 'AI/ML', 'Soft Skills', 'Bahasa', 'Lainnya']
const levels = ['beginner', 'intermediate', 'advanced', 'expert'] as const
const levelLabels = { beginner: 'Pemula', intermediate: 'Menengah', advanced: 'Mahir', expert: 'Expert' }
const levelColors = { beginner: 'secondary', intermediate: 'outline', advanced: 'default', expert: 'destructive' } as const

export default function StudentSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editSkill, setEditSkill] = useState<Skill | null>(null)
  const [form, setForm] = useState({ name: '', category: '', level: 'beginner' as typeof levels[number], description: '' })

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('created_at', { ascending: false })
    setSkills(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditSkill(null)
    setForm({ name: '', category: '', level: 'beginner', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (s: Skill) => {
    setEditSkill(s)
    setForm({ name: s.name, category: s.category, level: s.level, description: s.description ?? '' })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.category) { toast.error('Nama dan kategori wajib diisi'); return }
    setSubmitting(true)
    if (editSkill) {
      const { error } = await supabase.from('skills').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editSkill.id)
      if (error) toast.error('Gagal mengupdate skill')
      else toast.success('Skill diperbarui')
    } else {
      const { error } = await supabase.from('skills').insert(form)
      if (error) toast.error('Gagal menambahkan skill')
      else toast.success('Skill ditambahkan')
    }
    setSubmitting(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('skills').delete().eq('id', deleteId)
    if (error) toast.error('Gagal menghapus skill')
    else { toast.success('Skill dihapus'); load() }
    setDeleteId(null)
  }

  const handleSubmitVerification = async (skill: Skill) => {
    const { error } = await supabase.from('submissions').insert({
      type: 'skill',
      reference_id: skill.id,
      reference_name: skill.name,
      status: 'waiting',
    })
    if (error) toast.error('Gagal mengajukan verifikasi')
    else toast.success('Verifikasi diajukan! Tunggu review admin.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skill Saya</h1>
          <p className="text-muted-foreground">Kelola dan verifikasi skill profesional Anda</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" /> Tambah Skill
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Zap /></EmptyMedia>
            <EmptyTitle>Belum ada skill</EmptyTitle>
            <EmptyDescription>Tambahkan skill pertama Anda untuk mulai membangun profil profesional</EmptyDescription>
          </EmptyHeader>
          <Button onClick={openAdd} className="gap-2"><Plus className="size-4" />Tambah Skill</Button>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{skill.name}</CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">{skill.category}</Badge>
                  </div>
                  {skill.verified && (
                    <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant={levelColors[skill.level]}>{levelLabels[skill.level]}</Badge>
                {skill.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{skill.description}</p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(skill)} className="gap-1">
                    <Pencil className="size-3" /> Edit
                  </Button>
                  {!skill.verified && (
                    <Button size="sm" variant="outline" onClick={() => handleSubmitVerification(skill)} className="gap-1">
                      <Send className="size-3" /> Ajukan
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(skill.id)} className="gap-1 text-destructive hover:text-destructive">
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editSkill ? 'Edit Skill' : 'Tambah Skill Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Skill *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Misal: React.js" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level *</Label>
                <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v as typeof levels[number] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {levels.map((l) => <SelectItem key={l} value={l}>{levelLabels[l]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat tentang skill ini" className="resize-none" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {editSkill ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Skill?</AlertDialogTitle>
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
