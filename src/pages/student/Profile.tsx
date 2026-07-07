import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, User, BookOpen, Link2, Star, Save } from 'lucide-react'
import type { Profile } from '@/types'

export default function StudentProfile() {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Partial<Profile>>({})

  useEffect(() => {
    if (profile) setForm(profile)
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: form.full_name,
      student_id: form.student_id,
      faculty: form.faculty,
      major: form.major,
      semester: form.semester ? Number(form.semester) : null,
      gpa: form.gpa ? Number(form.gpa) : null,
      bio: form.bio,
      phone: form.phone,
      linkedin_url: form.linkedin_url,
      github_url: form.github_url,
    })
    setLoading(false)
    if (error) {
      toast.error('Gagal menyimpan profil')
    } else {
      toast.success('Profil berhasil disimpan')
      await refreshProfile()
    }
  }

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'MH'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi profil profesional Anda</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-20">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-lg font-semibold">{profile?.full_name ?? 'Nama Mahasiswa'}</h2>
              <p className="text-sm text-muted-foreground">{profile?.student_id ?? 'NIM belum diisi'}</p>
              <Badge variant="secondary" className="mt-2">{profile?.major ?? 'Jurusan'}</Badge>
              <Separator className="my-4" />
              <div className="flex w-full justify-between text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{profile?.total_points ?? 0}</div>
                  <div className="text-muted-foreground text-xs">Total Poin</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{profile?.semester ?? '-'}</div>
                  <div className="text-muted-foreground text-xs">Semester</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{profile?.gpa?.toFixed(2) ?? '-'}</div>
                  <div className="text-muted-foreground text-xs">IPK</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center gap-1.5 text-sm text-amber-600">
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <span className="font-medium">{profile?.total_points ?? 0} Poin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="size-4" /> Informasi Pribadi
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    value={form.full_name ?? ''}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">NIM</Label>
                  <Input
                    id="studentId"
                    value={form.student_id ?? ''}
                    onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                    placeholder="Nomor Induk Mahasiswa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor HP</Label>
                  <Input
                    id="phone"
                    value={form.phone ?? ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08xx xxxx xxxx"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={form.bio ?? ''}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Ceritakan tentang diri Anda..."
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="size-4" /> Informasi Akademik
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Fakultas</Label>
                  <Input
                    id="faculty"
                    value={form.faculty ?? ''}
                    onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                    placeholder="Misal: Teknik"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Jurusan / Program Studi</Label>
                  <Input
                    id="major"
                    value={form.major ?? ''}
                    onChange={(e) => setForm({ ...form, major: e.target.value })}
                    placeholder="Misal: Teknik Informatika"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    min={1}
                    max={14}
                    value={form.semester ?? ''}
                    onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                    placeholder="Semester ke-"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">IPK</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min={0}
                    max={4}
                    value={form.gpa ?? ''}
                    onChange={(e) => setForm({ ...form, gpa: Number(e.target.value) })}
                    placeholder="0.00 - 4.00"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="size-4" /> Tautan Profesional
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={form.linkedin_url ?? ''}
                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={form.github_url ?? ''}
                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="gap-2" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Simpan Profil
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
