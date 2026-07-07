import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Reward } from '@/types'
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
import { Gift, Plus, Pencil, Trash2, Star, Loader2, Package } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  general: 'Umum', voucher: 'Voucher', merchandise: 'Merchandise',
  certificate: 'Sertifikat', experience: 'Pengalaman',
}

export default function AdminRewardManagement() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<Reward | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', category: 'general',
    points_required: '', quantity: '', active: true,
  })

  const load = () => {
    supabase.from('rewards').select('*').order('points_required', { ascending: true }).then(({ data }) => {
      setRewards(data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: '', description: '', category: 'general', points_required: '', quantity: '', active: true })
    setDialogOpen(true)
  }

  const openEdit = (r: Reward) => {
    setEditItem(r)
    setForm({
      name: r.name, description: r.description ?? '', category: r.category ?? 'general',
      points_required: String(r.points_required),
      quantity: r.quantity >= 0 ? String(r.quantity) : '',
      active: r.active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.points_required) { toast.error('Nama dan poin wajib diisi'); return }
    setSubmitting(true)
    const qty = form.quantity ? parseInt(form.quantity) : -1
    const payload = {
      name: form.name, description: form.description || null, category: form.category,
      points_required: parseInt(form.points_required),
      quantity: qty, remaining_quantity: qty,
      active: form.active, updated_at: new Date().toISOString(),
    }
    if (editItem) {
      const { error } = await supabase.from('rewards').update(payload).eq('id', editItem.id)
      if (error) toast.error('Gagal mengupdate reward')
      else toast.success('Reward diperbarui')
    } else {
      const { error } = await supabase.from('rewards').insert({ ...payload, updated_at: undefined })
      if (error) toast.error('Gagal menambahkan reward')
      else toast.success('Reward ditambahkan')
    }
    setSubmitting(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('rewards').delete().eq('id', deleteId)
    if (error) toast.error('Gagal menghapus reward')
    else { toast.success('Reward dihapus'); load() }
    setDeleteId(null)
  }

  const toggleActive = async (r: Reward) => {
    await supabase.from('rewards').update({ active: !r.active }).eq('id', r.id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Gift className="size-6 text-primary" /> Kelola Reward
          </h1>
          <p className="text-muted-foreground">Tambah dan kelola reward yang dapat ditukar mahasiswa</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="size-4" /> Tambah Reward</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : rewards.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Package className="mx-auto mb-3 size-10 opacity-30" />
          <p className="font-medium">Belum ada reward</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((r) => (
            <Card key={r.id} className={!r.active ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{categoryLabels[r.category ?? 'general'] ?? r.category}</Badge>
                  <Badge variant={r.active ? 'default' : 'secondary'} className="text-xs">{r.active ? 'Aktif' : 'Nonaktif'}</Badge>
                </div>
                <CardTitle className="text-base mt-2">{r.name}</CardTitle>
                {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-600">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    {r.points_required.toLocaleString()} pts
                  </div>
                  {r.quantity >= 0 && (
                    <span className="text-xs text-muted-foreground">Stok: {r.remaining_quantity}</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => openEdit(r)} className="gap-1">
                    <Pencil className="size-3" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleActive(r)}>
                    {r.active ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(r.id)} className="text-destructive hover:text-destructive ml-auto">
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Reward' : 'Tambah Reward Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Reward *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama reward" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="resize-none" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Poin Diperlukan *</Label>
                <Input type="number" value={form.points_required} onChange={(e) => setForm({ ...form, points_required: e.target.value })} min={0} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Stok (kosongkan jika tidak terbatas)</Label>
              <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} min={0} placeholder="Tidak terbatas" />
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
            <AlertDialogTitle>Hapus Reward?</AlertDialogTitle>
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
