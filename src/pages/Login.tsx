import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { GraduationCap, Eye, EyeOff, ArrowLeft, Loader2, Shield } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(loginForm.email, loginForm.password)
    setLoading(false)
    if (error) {
      toast.error('Login gagal', { description: 'Email atau password tidak valid' })
    } else {
      toast.success('Login berhasil!')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Password tidak cocok')
      return
    }
    if (registerForm.password.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }
    setLoading(true)
    const { error } = await signUp(registerForm.email, registerForm.password, registerForm.fullName, 'student')
    setLoading(false)
    if (error) {
      toast.error('Registrasi gagal', { description: error })
    } else {
      toast.success('Registrasi berhasil! Silakan login.')
    }
  }

  const loginAsDemo = async (role: 'student' | 'admin') => {
    setLoading(true)
    const email = role === 'admin' ? 'admin@talenthub.demo' : 'student@talenthub.demo'
    const { error } = await signIn(email, 'demo123456')
    setLoading(false)
    if (error) {
      // Try to create demo account
      const fullName = role === 'admin' ? 'Admin Demo' : 'Mahasiswa Demo'
      const { error: signUpError } = await signUp(email, 'demo123456', fullName, role)
      if (!signUpError) {
        const { error: loginError } = await signIn(email, 'demo123456')
        if (loginError) toast.error('Gagal masuk ke akun demo')
      } else {
        toast.error('Gagal membuat akun demo')
      }
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <GraduationCap className="size-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">TalentHub Kampus</span>
        </div>
        <ModeToggle />
      </header>

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary">
              <GraduationCap className="size-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Selamat Datang</h1>
            <p className="mt-1 text-sm text-muted-foreground">Platform Manajemen Talenta Mahasiswa</p>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Masuk ke Akun</CardTitle>
                  <CardDescription>Gunakan email dan password Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password Anda"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Masuk
                    </Button>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs text-muted-foreground">
                        <span className="bg-background px-2">Atau coba akun demo</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loginAsDemo('student')}
                        disabled={loading}
                        className="gap-1.5"
                      >
                        <GraduationCap className="size-3.5" />
                        Demo Mahasiswa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loginAsDemo('admin')}
                        disabled={loading}
                        className="gap-1.5"
                      >
                        <Shield className="size-3.5" />
                        Demo Admin
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Buat Akun Mahasiswa</CardTitle>
                  <CardDescription>Daftar untuk mulai membangun profil profesional</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nama Lengkap</Label>
                      <Input
                        id="fullName"
                        placeholder="Masukkan nama lengkap"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Minimal 6 karakter"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Ulangi password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Daftar Sekarang
                    </Button>
                  </form>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Dengan mendaftar, Anda menyetujui Syarat & Ketentuan penggunaan platform
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
