import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'

import StudentLayout from '@/components/layout/StudentLayout'
import StudentDashboard from '@/pages/student/Dashboard'
import StudentProfile from '@/pages/student/Profile'
import StudentSkills from '@/pages/student/Skills'
import StudentCertificates from '@/pages/student/Certificates'
import StudentPortfolio from '@/pages/student/Portfolio'
import StudentSubmissions from '@/pages/student/Submissions'
import StudentOpportunities from '@/pages/student/Opportunities'
import StudentAI from '@/pages/student/AIRecommendation'
import StudentLeaderboard from '@/pages/student/Leaderboard'
import StudentRewards from '@/pages/student/Rewards'
import StudentRewardHistory from '@/pages/student/RewardHistory'

import AdminLayout from '@/components/layout/AdminLayout'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminStudents from '@/pages/admin/Students'
import AdminSkillVerification from '@/pages/admin/SkillVerification'
import AdminCertVerification from '@/pages/admin/CertificateVerification'
import AdminPortfolioVerification from '@/pages/admin/PortfolioVerification'
import AdminRewardManagement from '@/pages/admin/RewardManagement'
import AdminOpportunityManagement from '@/pages/admin/OpportunityManagement'
import AdminLeaderboard from '@/pages/admin/Leaderboard'
import { Spinner } from '@/components/ui/spinner'

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'student' | 'admin' }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole && profile && profile.role !== requiredRole) {
    return <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          user && profile ? (
            <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="skills" element={<StudentSkills />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="portfolio" element={<StudentPortfolio />} />
        <Route path="submissions" element={<StudentSubmissions />} />
        <Route path="opportunities" element={<StudentOpportunities />} />
        <Route path="ai-recommendation" element={<StudentAI />} />
        <Route path="leaderboard" element={<StudentLeaderboard />} />
        <Route path="rewards" element={<StudentRewards />} />
        <Route path="reward-history" element={<StudentRewardHistory />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="skill-verification" element={<AdminSkillVerification />} />
        <Route path="certificate-verification" element={<AdminCertVerification />} />
        <Route path="portfolio-verification" element={<AdminPortfolioVerification />} />
        <Route path="reward-management" element={<AdminRewardManagement />} />
        <Route path="opportunity-management" element={<AdminOpportunityManagement />} />
        <Route path="leaderboard" element={<AdminLeaderboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="talenthub-theme">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
