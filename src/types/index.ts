export type Role = 'student' | 'admin'

export interface Profile {
  id: string
  role: Role
  full_name: string | null
  student_id: string | null
  faculty: string | null
  major: string | null
  semester: number | null
  gpa: number | null
  bio: string | null
  avatar_url: string | null
  phone: string | null
  linkedin_url: string | null
  github_url: string | null
  total_points: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  user_id: string
  name: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  description: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  user_id: string
  name: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  credential_id: string | null
  credential_url: string | null
  description: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Portfolio {
  id: string
  user_id: string
  title: string
  description: string | null
  project_url: string | null
  repo_url: string | null
  tech_stack: string[]
  thumbnail_url: string | null
  type: 'project' | 'design' | 'research' | 'other'
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Submission {
  id: string
  user_id: string
  type: 'skill' | 'certificate' | 'portfolio'
  reference_id: string
  reference_name: string
  status: 'draft' | 'waiting' | 'approved' | 'rejected'
  notes: string | null
  rejection_reason: string | null
  points_awarded: number
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface PointHistory {
  id: string
  user_id: string
  type: 'earned' | 'spent'
  points: number
  description: string
  reference_id: string | null
  created_at: string
}

export interface Reward {
  id: string
  name: string
  description: string | null
  points_required: number
  quantity: number
  remaining_quantity: number
  image_url: string | null
  category: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface RewardRedemption {
  id: string
  user_id: string
  reward_id: string
  reward_name: string
  points_spent: number
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled'
  created_at: string
  updated_at: string
  rewards?: Reward
}

export interface Opportunity {
  id: string
  title: string
  description: string | null
  type: 'internship' | 'competition' | 'scholarship' | 'event' | 'research'
  company: string | null
  location: string | null
  deadline: string | null
  requirements: string[]
  link: string | null
  active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface OpportunityApplication {
  id: string
  user_id: string
  opportunity_id: string
  status: 'applied' | 'reviewed' | 'accepted' | 'rejected'
  notes: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'submission' | 'reward' | 'opportunity' | 'system'
  read: boolean
  created_at: string
}

export interface LeaderboardEntry {
  id: string
  full_name: string | null
  student_id: string | null
  faculty: string | null
  major: string | null
  avatar_url: string | null
  total_points: number
  rank?: number
}
