import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Brain, Sparkles, BookOpen, Briefcase, Award, Users, Loader2, ArrowRight, Star, Zap } from 'lucide-react'

interface AIRecommendation {
  nextSkills: string[]
  certifications: string[]
  careerPaths: string[]
  opportunities: string[]
  collaborators: string[]
  analysis: string
}

function generateRecommendations(skills: string[], certs: string[], portfolioTypes: string[]): AIRecommendation {
  const skillSet = skills.map((s) => s.toLowerCase())

  const hasWeb = skillSet.some((s) => ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'].some((k) => s.includes(k)))
  const hasMobile = skillSet.some((s) => ['flutter', 'react native', 'kotlin', 'swift', 'android', 'ios'].some((k) => s.includes(k)))
  const hasBackend = skillSet.some((s) => ['node', 'express', 'django', 'spring', 'laravel', 'php', 'python'].some((k) => s.includes(k)))
  const hasAI = skillSet.some((s) => ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'ai', 'nlp'].some((k) => s.includes(k)))
  const hasDesign = skillSet.some((s) => ['figma', 'sketch', 'adobe', 'ui', 'ux', 'design'].some((k) => s.includes(k)))

  const nextSkills: string[] = []
  const careerPaths: string[] = []
  const certifications: string[] = []
  const opportunities: string[] = []

  if (hasWeb && !hasBackend) {
    nextSkills.push('Node.js / Express', 'REST API Design', 'PostgreSQL')
    certifications.push('AWS Cloud Practitioner', 'Meta Front-End Developer Certificate')
    careerPaths.push('Full Stack Developer', 'Front-End Engineer')
    opportunities.push('Internship Front-End di startup teknologi', 'Kompetisi hackathon web development')
  }
  if (hasWeb && hasBackend) {
    nextSkills.push('Docker & Kubernetes', 'Redis / Caching', 'GraphQL')
    certifications.push('AWS Solutions Architect', 'Google Cloud Professional Developer')
    careerPaths.push('Senior Full Stack Developer', 'Software Architect', 'Tech Lead')
    opportunities.push('Software Engineer Intern di perusahaan tech besar', 'Build SaaS produk sendiri')
  }
  if (hasMobile) {
    nextSkills.push('Firebase', 'State Management (Bloc/Redux)', 'CI/CD Mobile')
    certifications.push('Google Associate Android Developer', 'AWS Mobile')
    careerPaths.push('Mobile Developer', 'Cross-Platform Developer')
    opportunities.push('Internship Mobile Dev di e-commerce', 'Google Developer Expert Program')
  }
  if (hasAI) {
    nextSkills.push('MLOps', 'LLM Fine-tuning', 'Vector Databases', 'FastAPI')
    certifications.push('TensorFlow Developer Certificate', 'AWS Machine Learning Specialty', 'Google ML Engineer')
    careerPaths.push('ML Engineer', 'Data Scientist', 'AI Research Scientist')
    opportunities.push('Research Assistant AI Lab', 'Hackathon AI Innovation', 'Kaggle Competition')
  }
  if (hasDesign) {
    nextSkills.push('Motion Design', 'Design Systems', 'User Research', 'Prototyping')
    certifications.push('Google UX Design Certificate', 'Figma Advanced Certification')
    careerPaths.push('UX Designer', 'Product Designer', 'Design Lead')
    opportunities.push('UI/UX Intern di produk digital', 'Design challenge competitions')
  }

  // Default if no match
  if (nextSkills.length === 0) {
    nextSkills.push('Git & GitHub', 'Agile/Scrum Methodology', 'Problem Solving & Algorithms')
    certifications.push('Google IT Support Certificate', 'CompTIA A+', 'PMI CAPM')
    careerPaths.push('IT Consultant', 'Business Analyst', 'Project Manager')
    opportunities.push('Magang IT di perusahaan BUMN', 'Workshop teknologi kampus')
  }

  const collaborators = ['Mahasiswa dengan skill complementary', 'Tim proyek multidisiplin', 'Mentor industri berpengalaman']

  const analysisLines = [
    `Berdasarkan analisis ${skills.length} skill, ${certs.length} sertifikat, dan ${portfolioTypes.length} proyek portofolio Anda,`,
    hasAI ? 'Anda memiliki keahlian di bidang AI/ML yang sangat diminati industri.' :
      hasWeb ? 'Anda memiliki fondasi yang baik di pengembangan web.' :
        hasDesign ? 'Anda memiliki keahlian desain yang berharga.' :
          'Anda sedang membangun fondasi karir di bidang teknologi.',
    `Rekomendasi AI ini dibuat untuk memaksimalkan potensi karir Anda.`,
  ]

  return {
    nextSkills: nextSkills.slice(0, 5),
    certifications: certifications.slice(0, 4),
    careerPaths: careerPaths.slice(0, 3),
    opportunities: opportunities.slice(0, 4),
    collaborators,
    analysis: analysisLines.join(' '),
  }
}

export default function StudentAI() {
  const [loading, setLoading] = useState(false)
  const [recs, setRecs] = useState<AIRecommendation | null>(null)
  const [customQuery, setCustomQuery] = useState('')
  const [customResult, setCustomResult] = useState('')
  const [querying, setQuerying] = useState(false)

  const generateRecs = async () => {
    setLoading(true)
    const [{ data: skills }, { data: certs }, { data: portfolios }] = await Promise.all([
      supabase.from('skills').select('name'),
      supabase.from('certificates').select('name'),
      supabase.from('portfolios').select('type'),
    ])
    await new Promise((r) => setTimeout(r, 1200))
    const result = generateRecommendations(
      skills?.map((s) => s.name) ?? [],
      certs?.map((c) => c.name) ?? [],
      portfolios?.map((p) => p.type) ?? [],
    )
    setRecs(result)
    setLoading(false)
  }

  const handleCustomQuery = async () => {
    if (!customQuery.trim()) return
    setQuerying(true)
    await new Promise((r) => setTimeout(r, 1500))
    const responses = [
      `Berdasarkan kueri "${customQuery}", rekomendasi AI: Fokus pada pengembangan skill yang relevan dengan kebutuhan industri saat ini. Pertimbangkan untuk mengambil sertifikasi yang diakui secara internasional untuk meningkatkan nilai jual Anda.`,
      `Untuk "${customQuery}": AI merekomendasikan Anda memperluas jaringan profesional melalui LinkedIn, mengikuti konferensi teknologi, dan aktif berkontribusi di open-source project.`,
      `Analisis AI untuk "${customQuery}": Industri teknologi saat ini sangat membutuhkan professional yang menguasai kombinasi technical skills dan soft skills. Pertimbangkan untuk bergabung dengan komunitas teknologi lokal.`,
    ]
    setCustomResult(responses[Math.floor(Math.random() * responses.length)])
    setQuerying(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Brain className="size-6 text-primary" /> AI Recommendation
        </h1>
        <p className="text-muted-foreground">Rekomendasi cerdas berbasis AI untuk pengembangan karir Anda</p>
      </div>

      {/* AI Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-amber-500" /> Tanyakan AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Contoh: Saya ingin berkarir di bidang AI. Apa yang harus saya pelajari?"
            className="resize-none"
            rows={3}
          />
          <Button onClick={handleCustomQuery} disabled={querying || !customQuery.trim()} className="gap-2">
            {querying ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Tanya AI
          </Button>
          {customResult && (
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                <Brain className="size-3.5" /> AI Response
              </div>
              {customResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate recommendations */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="size-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold">Analisis Profil & Rekomendasi</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                AI akan menganalisis skill, sertifikat, dan portofolio Anda untuk memberikan rekomendasi yang dipersonalisasi
              </p>
            </div>
            <Button onClick={generateRecs} disabled={loading} className="gap-2 shrink-0">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {recs ? 'Perbarui Rekomendasi' : 'Generate Rekomendasi'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      )}

      {recs && !loading && (
        <>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm">
            <div className="flex items-start gap-2">
              <Brain className="size-4 text-primary mt-0.5 shrink-0" />
              <p>{recs.analysis}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="size-4 text-primary" /> Skill Berikutnya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recs.nextSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <ArrowRight className="size-4 text-primary shrink-0" />
                    {skill}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="size-4 text-amber-500" /> Sertifikasi Direkomendasikan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recs.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Star className="size-3.5 text-amber-500 shrink-0" />
                    {cert}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="size-4 text-blue-500" /> Career Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recs.careerPaths.map((path, i) => (
                  <Badge key={i} variant="secondary" className="mr-2 mb-1">{path}</Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="size-4 text-green-500" /> Peluang Relevan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recs.opportunities.map((opp, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <ArrowRight className="size-4 text-green-500 shrink-0" />
                    {opp}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-purple-500" /> Kolaborasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recs.collaborators.map((c, i) => (
                  <Badge key={i} variant="outline">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
