'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { DashboardShell } from '@/components/dashboard-shell'
import { getProjectById } from '@/lib/projects-store'
import { getApplications, updateApplicationStatus } from '@/lib/applications-store'
import { formatINR } from '@/lib/mock-data'

export default function ProjectApplications() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const [userName, setUserName] = useState('Owner')
  const [project, setProject] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/'); return }
    const user = JSON.parse(stored)
    if (user.role !== 'owner') { router.push('/'); return }
    setUserName(user.name || 'Owner')
  }, [router])

  useEffect(() => {
    const proj = getProjectById(projectId)
    setProject(proj)
    setApplications(getApplications(projectId))
    setLoading(false)
  }, [projectId])

  const handleAccept = (appId: string) => {
    updateApplicationStatus(appId, 'accepted')
    setApplications(getApplications(projectId))
    toast.success('Application accepted')
  }

  const handleReject = (appId: string) => {
    updateApplicationStatus(appId, 'rejected')
    setApplications(getApplications(projectId))
    toast.success('Application rejected')
  }

  if (loading) {
    return (
      <DashboardShell role="owner" userName={userName}>
        <div className="py-12 text-center">Loading...</div>
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

  return (
    <DashboardShell role="owner" userName={userName}>
      <Link
        href={`/owner-dashboard/${projectId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F97316]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Project Dashboard
      </Link>

      <h1 className="mb-2 font-serif text-2xl font-bold text-[#0A1929]">{project.name}</h1>
      <p className="mb-6 text-sm text-[#64748B]">Applications for this project</p>

      {applications.length === 0 && (
        <p className="text-center text-[#64748B]">No applications yet.</p>
      )}

      <div className="space-y-4">
        {applications.map(app => (
          <div key={app.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#0A1929] capitalize">{app.applicantRole}</h3>
                <p className="text-sm text-[#64748B]">{app.applicantEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  app.status === 'accepted' ? 'bg-[#10B981]/10 text-[#10B981]' :
                  app.status === 'rejected' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                  'bg-[#F59E0B]/10 text-[#F59E0B]'
                }`}>
                  {app.status === 'pending' ? 'Pending' : app.status === 'accepted' ? 'Accepted' : 'Rejected'}
                </span>
              </div>
            </div>
            <p className="mb-2 text-sm text-[#1E293B]">📝 {app.message}</p>
            <div className="mb-4 flex gap-4 text-sm">
              <span className="text-[#64748B]">Fee: {formatINR(app.proposedFee)}</span>
              <span className="text-[#64748B]">Timeline: {app.proposedTimeline} months</span>
            </div>
            {app.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(app.id)}
                  className="flex items-center gap-1 rounded-lg bg-[#10B981] px-4 py-2 text-sm text-white hover:bg-[#0D9488]"
                >
                  <CheckCircle className="h-4 w-4" /> Accept
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  className="flex items-center gap-1 rounded-lg border border-[#EF4444] px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/5"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}