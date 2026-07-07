import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/mode-toggle'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Users,
  Award,
  FolderCheck,
  Gift,
  Briefcase,
  Trophy,
  GraduationCap,
  LogOut,
  Shield,
  Zap,
} from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/students', icon: Users, label: 'Data Mahasiswa' },
  { to: '/admin/skill-verification', icon: Zap, label: 'Verifikasi Skill' },
  { to: '/admin/certificate-verification', icon: Award, label: 'Verifikasi Sertifikat' },
  { to: '/admin/portfolio-verification', icon: FolderCheck, label: 'Verifikasi Portofolio' },
  { to: '/admin/reward-management', icon: Gift, label: 'Kelola Reward' },
  { to: '/admin/opportunity-management', icon: Briefcase, label: 'Kelola Opportunity' },
  { to: '/admin/leaderboard', icon: Trophy, label: 'Leaderboard' },
]

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Berhasil keluar')
    navigate('/')
  }

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'AD'

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="size-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold">TalentHub</div>
                <div className="text-xs text-muted-foreground">Admin Panel</div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map(({ to, icon: Icon, label }) => (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={to}
                          className={({ isActive }) =>
                            isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
                          }
                        >
                          <Icon className="size-4" />
                          <span>{label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{profile?.full_name ?? 'Administrator'}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="size-3 text-primary" />
                  <span>Administrator</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-muted-foreground transition-colors hover:text-destructive"
                title="Keluar"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b bg-background px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Shield className="size-3" />
                Admin
              </Badge>
              <ModeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
