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
  User,
  Zap,
  Award,
  FolderOpen,
  ClipboardList,
  Briefcase,
  Brain,
  Trophy,
  Gift,
  History,
  GraduationCap,
  LogOut,
  Star,
} from 'lucide-react'

const navItems = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile', icon: User, label: 'Profil' },
  { to: '/student/skills', icon: Zap, label: 'Skill' },
  { to: '/student/certificates', icon: Award, label: 'Sertifikat' },
  { to: '/student/portfolio', icon: FolderOpen, label: 'Portofolio' },
  { to: '/student/submissions', icon: ClipboardList, label: 'Pengajuan' },
  { to: '/student/opportunities', icon: Briefcase, label: 'Opportunity' },
  { to: '/student/ai-recommendation', icon: Brain, label: 'AI Recommendation' },
  { to: '/student/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/student/rewards', icon: Gift, label: 'Reward' },
  { to: '/student/reward-history', icon: History, label: 'Riwayat Reward' },
]

export default function StudentLayout() {
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
    .slice(0, 2) ?? 'MH'

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
                <div className="text-xs text-muted-foreground">Mahasiswa Portal</div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
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
                <div className="truncate text-sm font-medium">{profile?.full_name ?? 'Mahasiswa'}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 text-amber-500" />
                  <span>{profile?.total_points ?? 0} poin</span>
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
              <Badge variant="secondary" className="gap-1">
                <Star className="size-3 text-amber-500" />
                {profile?.total_points ?? 0} Poin
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
