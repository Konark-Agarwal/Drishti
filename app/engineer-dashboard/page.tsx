'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, MapPin, IndianRupee, Calendar, X } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { mockProjects, mockApplications, mockUsers, formatINR, timeAgo } from '@/lib/mock-data'
import { toast } from 'sonner'
import { addApplication } from '@/lib/applications-store'


type Tab = 'available' | 'active'

export default function EngineerDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('Engineer')
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('available')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [coverNote, setCoverNote] = useState('')
  const [timeline, setTimeline] = useState('')
  const [fee, setFee] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      router.push('/')
      return
    }
    const user = JSON.parse(stored)
    if (user.role !== 'engineer') {
      router.push('/')
      return
    }
    setUserName(user.name || 'Engineer')
    setUserEmail(user.email)
  }, [router])

  // Get accepted project IDs for this engineer
  const acceptedAppIds = mockApplications
    .filter(app => app.applicantEmail === userEmail && app.status === 'accepted')
    .map(app => app.projectId)

  const availableProjects = mockProjects.filter(p => !acceptedAppIds.includes(p.id))
  const activeProjects = mockProjects.filter(p => acceptedAppIds.includes(p.id))

  const handleApply = (project: any) => {
    setSelectedProject(project)
    setCoverNote('')
    setTimeline('')
    setFee('')
  }

  const submitApplication = () => {
  if (!coverNote || !timeline || !fee) {
    toast.error('Please fill all fields')
    return
  }
  setLoading(true)

  try {
    addApplication({
      projectId: selectedProject.id,
      applicantEmail: userEmail,       // ✅ Make sure userEmail is used here
      applicantRole: 'engineer',
      message: coverNote,
      proposedFee: parseInt(fee),
      proposedTimeline: parseInt(timeline),
    })
    toast.success('Application submitted successfully!')
    setSelectedProject(null)
  } catch (err) {
    console.error(err)
    toast.error('Failed to submit application')
  } finally {
    setLoading(false)
  }
}

  return (
    <DashboardShell role="engineer" userName={userName}>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-white p-1 border border-[#E2E8F0] w-fit">
        <button
          onClick={() => setActiveTab('available')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'available'
              ? 'bg-[#3B82F6] text-white'
              : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          Available Projects
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-[#3B82F6] text-white'
              : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          My Active Projects
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableProjects.map(project => {
            const owner = mockUsers.find(u => u.email === project.ownerEmail)
            return (
              <div
                key={project.id}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)]"
              >
                <h3 className="font-serif text-lg font-semibold text-[#0A1929]">{project.name}</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <IndianRupee className="h-4 w-4" />
                    {formatINR(project.budget)}
                  </div>
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Briefcase className="h-4 w-4" />
                    Owner: {owner?.name || 'Unknown'}
                  </div>
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Calendar className="h-4 w-4" />
                    Posted {timeAgo(project.createdAt)}
                  </div>
                </div>
                <button
                  onClick={() => handleApply(project)}
                  className="mt-4 w-full rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563EB]"
                >
                  Apply for Tender
                </button>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeProjects.map(project => (
            <div
              key={project.id}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)]"
            >
              <h3 className="font-serif text-lg font-semibold text-[#0A1929]">{project.name}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <IndianRupee className="h-4 w-4" />
                  {formatINR(project.budget)}
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#64748B]">Progress</span>
                    <span className="text-[#1E293B]">{project.progressPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E2E8F0]">
                    <div
                      className="h-2 rounded-full bg-[#3B82F6]"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <Link
                href={`/engineer-dashboard/${project.id}`}
                className="mt-4 inline-block w-full rounded-lg border border-[#3B82F6] px-4 py-2 text-center text-sm font-medium text-[#3B82F6] hover:bg-[#3B82F6]/5"
              >
                Monitor & Plan →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Custom Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-[#0A1929]">
                Apply for {selectedProject.name}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-[#64748B] hover:text-[#1E293B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submitApplication()
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm text-[#64748B]">Cover Note</label>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Why are you the best engineer for this job?"
                  rows={4}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#64748B]">Expected Timeline (months)</label>
                <input
                  type="number"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#64748B]">Proposed Fee (₹)</label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="e.g., 350000"
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#3B82F6] px-4 py-2 font-medium text-white hover:bg-[#2563EB] disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Send Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}