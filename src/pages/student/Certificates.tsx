import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Certificate } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { toast } from 'sonner'
import { Plus, Award, Pencil, Trash2, CheckCircle2, Loader2, Send, ExternalLink, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function StudentCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editCert, setEditCert] = useState<Certificate | null>(null)
  const [form, setForm] = useState({
    name: '', issuer: '', issue_date: '', expiry_date: '', credential_id: '', credential_url: '', description: '',
  })

  const load = async () => {
    const { data } = await supabase.from('certificates').select('*').order('issue_date', { ascending: false })
    setCerts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditCert(null)
    setForm({ name: '', issuer: '', issue_date: '', expiry_date: '', credential_id: '', credential_url: '', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (c: Certificate) => {
    setEditCert(c)
    setForm({
      name: c.name, issuer: c.issuer, issue_date: c.issue_date, expiry_date: c.expiry_date ?? '',
      credential_id: c.credential_id ?? '', credential_url: c.credential_url ?? '', description: c.description ?? '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.issuer || !form.issue_date) { toast.error('Nama, penerbit, dan tanggal wajib diisi'); return }
    setSubmitting(true)
    const payload = { ...form, expiry_date: form.expiry_date || null, updated_at: new Date().toISOString() }
    if (editCert) {
      const { error } = await supabase.from('certificates').update(payload).eq('id', editCert.id)
      if (error) toast.error('Gagal mengupdate sertifikat')
      else toast.success('Sertifikat diperbarui')
    } else {
      const { error } = await supabase.from('certificates').insert(form)
      if (error) toast.error('Gagal menambahkan sertifikat')
      else toast.success('Sertifikat ditambahkan')
    }
    setSubmitting(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('certificates').delete().eq('id', deleteId)
    if (error) toast.error('Gagal menghapus sertifikat')
    else { toast.success('Sertifikat dihapus'); load() }
    setDeleteId(null)
  }

  const handleSubmitVerification = async (cert: Certificate) => {
    const { error } = await supabase.from('submissions').insert({
      type: 'certificate', reference_id: cert.id, reference_name: cert.name, status: 'waiting',
    })
    if (error) toast.error('Gagal mengajukan verifikasi')
    else toast.success('Verifikasi diajukan!')
  }

  const formatDate = (d: string) => {
    try { return format(new Date(d), 'dd MMM yyyy', { locale: idLocale }) } catch { return d }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sertifikat</h1>
          <p className="text-muted-foreground">Kelola sertifikat dan bukti kompetensi Anda</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="size-4" /> Tambah Sertifikat</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-44 rounded-xl border bg-muted/30 animate-pulse" />)}
        </div>
      ) : certs.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Award /></EmptyMedia>
            <EmptyTitle>Belum ada sertifikat</EmptyTitle>
            <EmptyDescription>Tambahkan sertifikat untuk menunjukkan kompetensi Anda</EmptyDescription>
          </EmptyHeader>
          <Button onClick={openAdd} className="gap-2"><Plus className="size-4" />Tambah Sertifikat</Button>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certs.map((cert) => (
            <Card key={cert.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Award className="size-5 text-amber-500" />
                  </div>
                  {cert.verified && <CheckCircle2 className="size-5 shrink-0 text-green-500" />}
                </div>
                <CardTitle className="text-base mt-2">{cert.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>Diterbitkan: {formatDate(cert.issue_date)}</span>
                  {cert.expiry_date && <span>· Berlaku s/d: {formatDate(cert.expiry_date)}</span>}
                </div>
                {cert.credential_id && (
                  <p className="text-xs text-muted-foreground">ID: {cert.credential_id}</p>
                )}
                {cert.description && <p className="text-xs text-muted-foreground line-clamp-2">{cert.description}</p>}
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => openEdit(cert)} className="gap-1">
                    <Pencil className="size-3" /> Edit
                  </Button>
                  {!cert.verified && (
                    <Button size="sm" variant="outline" onClick={() => handleSubmitVerification(cert)} className="gap-1">
                      <Send className="size-3" /> Ajukan
                    </Button>
                  )}
                  {cert.credential_url && (
                    <Button size="sm" variant="ghost" asChild className="gap-1">
                      <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-3" /> Lihat
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(cert.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editCert ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Sertifikat *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Misal: AWS Solutions Architect" />
            </div>
            <div className="space-y-2">
              <Label>Penerbit / Issuer *</Label>
              <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Misal: Amazon Web Services" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Terbit *</Label>
                <Input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Berlaku Hingga</Label>
                <Input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Credential ID</Label>
                <Input value={form.credential_id} onChange={(e) => setForm({ ...form, credential_id: e.target.value })} placeholder="ID unik sertifikat" />
              </div>
              <div className="space-y-2">
                <Label>URL Verifikasi</Label>
                <Input value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat sertifikat..." className="resize-none" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {editCert ? 'Simpan' : 'Tambahkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Sertifikat?</AlertDialogTitle>
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
