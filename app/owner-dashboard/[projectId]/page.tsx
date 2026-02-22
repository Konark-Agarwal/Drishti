'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, IndianRupee, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
import { DashboardShell } from '@/components/dashboard-shell'
import { getProjectById } from '@/lib/projects-store'
import { getAlerts } from '@/lib/alerts-store'
import { getPhotos } from '@/lib/photos-store'
import { getMaterialLogs } from '@/lib/material-logs-store'
import { mockPlans, formatINR, timeAgo, Alert, Photo, MaterialLog, Project } from '@/lib/mock-data'

const COLORS = ['#F97316', '#E2E8F0']
const MILESTONE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']

export default function OwnerProjectDetail() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [userName, setUserName] = useState('Owner')
  const [project, setProject] = useState<Project | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [materialLogs, setMaterialLogs] = useState<MaterialLog[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [highlightedPhotoId, setHighlightedPhotoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not logged in or wrong role
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/'); return }
    const user = JSON.parse(stored)
    if (user.role !== 'owner') { router.push('/'); return }
    setUserName(user.name || 'Owner')
  }, [router])

  // Fetch project data (client-side only)
  useEffect(() => {
    const fetchProject = () => {
      const proj = getProjectById(projectId)
      setProject(proj || null)
      setLoading(false)
    }
    fetchProject()
  }, [projectId])

  // Poll for dynamic data
  useEffect(() => {
    const fetchData = () => {
      setAlerts(getAlerts(projectId))
      setPhotos(getPhotos(projectId))
      setMaterialLogs(getMaterialLogs(projectId))
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [projectId])

  if (loading) {
    return (
      <DashboardShell role="owner" userName={userName}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
        </div>
      </DashboardShell>
    )
  }

  if (!project) {
    return (
      <DashboardShell role="owner" userName={userName}>
        <p className="text-[#64748B]">Project not found.</p>
      </DashboardShell>
    )
  }

  const plan = mockPlans.find(p => p.projectId === projectId)

  const pieData = [
    { name: 'Completed', value: project.progressPercent },
    { name: 'Remaining', value: 100 - project.progressPercent },
  ]

  const milestoneData = plan
    ? Object.entries(plan.milestones || {}).map(([name]) => {
        const completion = name === 'foundation' ? 100 : name === 'structure' ? 40 : name === 'roof' ? 10 : 0
        return { name: name.charAt(0).toUpperCase() + name.slice(1), completion }
      })
    : []

  const materialComparisonData = plan
    ? [
        { name: 'Cement', planned: plan.materials.cement || 500, actual: materialLogs.filter(m => m.materialName === 'Cement').reduce((sum, m) => sum + m.quantityUsed, 0), unit: 'Bags' },
        { name: 'Steel', planned: plan.materials.steel || 10, actual: materialLogs.filter(m => m.materialName === 'Steel').reduce((sum, m) => sum + m.quantityUsed, 0), unit: 'Tons' },
        { name: 'Bricks', planned: (plan.materials.bricks || 25000) / 1000, actual: materialLogs.filter(m => m.materialName === 'Bricks').reduce((sum, m) => sum + m.quantityUsed, 0) / 1000, unit: 'K Units' },
        { name: 'Sand', planned: plan.materials.sand || 50, actual: materialLogs.filter(m => m.materialName === 'Sand').reduce((sum, m) => sum + m.quantityUsed, 0), unit: 'Tons' },
      ]
    : []

  const statusConfig = {
    'on-track': { label: 'On Track', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]' },
    'at-risk': { label: 'At Risk', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]' },
    delayed: { label: 'Delayed', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' },
  }

  const severityConfig = {
    high: { icon: '🔴', label: 'FRAUD ALERT', bg: 'bg-[#EF4444]/5', border: 'border-[#EF4444]/20', text: 'text-[#EF4444]' },
    medium: { icon: '🟡', label: 'WARNING', bg: 'bg-[#F59E0B]/5', border: 'border-[#F59E0B]/20', text: 'text-[#92400E]' },
    low: { icon: '🔵', label: 'INFO', bg: 'bg-[#3B82F6]/5', border: 'border-[#3B82F6]/20', text: 'text-[#1E40AF]' },
    info: { icon: '🟢', label: 'INFO', bg: 'bg-[#10B981]/5', border: 'border-[#10B981]/20', text: 'text-[#065F46]' },
  }

  const budgetUsed = Math.round((project.progressPercent * project.budget) / 100)
  const status = statusConfig[project.status]
  const openAlerts = alerts.filter(a => !a.resolved).length
  const selectedPhotoData = photos.find(p => p.id === selectedPhoto)

  // Calculate time elapsed dynamically
  const calculateTimeElapsed = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()

    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    let elapsedMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
    
    // Clamp to 0 and total
    elapsedMonths = Math.max(0, Math.min(elapsedMonths, totalMonths))
    
    return {
      elapsed: elapsedMonths.toFixed(1),
      total: totalMonths
    }
  }

  const timeElapsed = calculateTimeElapsed(project.startDate, project.endDate)
  const timeElapsedString = `${timeElapsed.elapsed} / ${timeElapsed.total} months`

  const viewAlertDetails = (alert: Alert) => {
    if (photos.length > 0) {
      const latestPhoto = photos[0]
      setHighlightedPhotoId(latestPhoto.id)
      document.getElementById('photo-gallery')?.scrollIntoView({ behavior: 'smooth' })
      toast.info('Highlighted related photo in gallery')
      setTimeout(() => setHighlightedPhotoId(null), 3000)
    } else {
      toast.info('No photos available for this project')
    }
  }

  return (
    <DashboardShell role="owner" userName={userName}>
      <Link
        href="/owner-dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F97316]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Projects
      </Link>

      {/* Header & Summary */}
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-bold text-[#0A1929]">{project.name}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <QuickStat label="Overall Progress" value={`${project.progressPercent}%`} icon={<div className="h-8 w-8"><PieChart width={32} height={32}><Pie data={pieData} cx={16} cy={16} innerRadius={8} outerRadius={14} dataKey="value" strokeWidth={0}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie></PieChart></div>} />
          <QuickStat label="Budget Health" value={`${formatINR(budgetUsed)} / ${formatINR(project.budget)}`} icon={<IndianRupee className="h-5 w-5 text-[#3B82F6]" />} />
          <QuickStat label="Time Elapsed" value={timeElapsedString} icon={<Clock className="h-5 w-5 text-[#F59E0B]" />} />
          <QuickStat label="Active Alerts" value={String(openAlerts)} icon={<AlertTriangle className="h-5 w-5 text-[#EF4444]" />} highlight={openAlerts > 0} />
        </div>
      </div>

      {/* AI Officer Live Feed */}
      <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <h2 className="mb-4 font-serif text-lg font-semibold text-[#0A1929]">🚨 AI Officer Live Feed</h2>
        <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto pr-2">
          {alerts.length === 0 && (
            <p className="text-center text-sm text-[#64748B]">No new alerts. All quiet on site.</p>
          )}
          {alerts.map((alert) => {
            const config = severityConfig[alert.severity]
            return (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 transition-all hover:shadow-md ${config.bg} ${config.border}`}
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-base">{config.icon}</span>
                  <span className={`text-xs font-semibold uppercase ${config.text}`}>{config.label}</span>
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                    alert.severity === 'high' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                    alert.severity === 'medium' ? 'bg-[#F59E0B]/10 text-[#92400E]' :
                    'bg-[#10B981]/10 text-[#065F46]'
                  }`}>
                    {alert.severity === 'high' ? 'High' : alert.severity === 'medium' ? 'Medium' : 'Info'}
                  </span>
                  <span className="ml-auto text-xs text-[#94A3B8]">{timeAgo(alert.createdAt)}</span>
                </div>
                <p className={`text-sm ${config.text}`}>{alert.message}</p>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => viewAlertDetails(alert)}
                    className="text-xs font-medium text-[#F97316] hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Progress Pie */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
          <h3 className="mb-4 font-serif text-base font-semibold text-[#0A1929]">Overall Project Completion</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  strokeWidth={0}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {milestoneData.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {milestoneData.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-[#64748B]">{m.name}</span>
                  <div className="h-2 flex-1 rounded-full bg-[#E2E8F0]">
                    <div className="h-2 rounded-full" style={{ width: `${m.completion}%`, backgroundColor: MILESTONE_COLORS[i % MILESTONE_COLORS.length] }} />
                  </div>
                  <span className="w-10 text-right text-xs font-medium text-[#1E293B]">{m.completion}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Material Consumption */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
          <h3 className="mb-4 font-serif text-base font-semibold text-[#0A1929]">Key Materials vs. Plan</h3>
          {materialComparisonData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materialComparisonData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#1E293B' }} width={60} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="planned" name="Planned" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#F97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-lg bg-[#F8FAFC]">
              <p className="text-sm text-[#64748B]">No material plan available for this project.</p>
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery */}
      <div id="photo-gallery" className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <h3 className="mb-4 font-serif text-base font-semibold text-[#0A1929]">Site Photo History (AI-Verified)</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo.id)}
              className={`group relative aspect-square overflow-hidden rounded-xl border transition-all ${
                highlightedPhotoId === photo.id
                  ? 'border-4 border-[#F97316] shadow-lg'
                  : 'border-[#E2E8F0] hover:border-[#F97316]'
              }`}
            >
              <img src={photo.url} alt="Site" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2">
                {photo.aiVerified === true && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981] px-2 py-0.5 text-[0.65rem] font-medium text-white">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                )}
                {photo.aiVerified === false && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EF4444] px-2 py-0.5 text-[0.65rem] font-medium text-white">
                    <XCircle className="h-3 w-3" /> Flagged
                  </span>
                )}
                {photo.aiVerified === null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#64748B] px-2 py-0.5 text-[0.65rem] font-medium text-white">
                    <Loader2 className="h-3 w-3 animate-spin" /> Pending
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhotoData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-[#0A1929]">Photo Details</h3>
              <button onClick={() => setSelectedPhoto(null)} className="text-[#64748B] hover:text-[#1E293B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <img src={selectedPhotoData.imageUrl} alt="Detail" className="mb-4 w-full rounded-xl" />
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div><span className="text-[#64748B]">GPS:</span> {selectedPhotoData.gpsLat}, {selectedPhotoData.gpsLng}</div>
              <div><span className="text-[#64748B]">Time:</span> {new Date(selectedPhotoData.timestamp).toLocaleString()}</div>
              <div><span className="text-[#64748B]">Uploaded by:</span> {selectedPhotoData.uploadedByEmail}</div>
              <div><span className="text-[#64748B]">AI Verified:</span> <span className={selectedPhotoData.aiVerified ? 'text-[#10B981]' : 'text-[#EF4444]'}>{selectedPhotoData.aiVerified ? 'Yes' : 'No'}</span></div>
              <div className="md:col-span-2"><span className="text-[#64748B]">AI Notes:</span> {selectedPhotoData.aiNotes}</div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

function QuickStat({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="text-xs text-[#64748B]">{label}</span>
      </div>
      <p className={`font-serif text-xl font-bold ${highlight ? 'text-[#EF4444]' : 'text-[#1E293B]'}`}>{value}</p>
    </div>
  )
}