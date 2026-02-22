import { NextResponse } from 'next/server'
import { mockAlerts } from '@/lib/mock-data'

// GET /api/alerts - Get alerts for a project
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')

  let alerts = mockAlerts
  if (projectId) {
    alerts = alerts.filter((a) => a.projectId === projectId)
  }

  // Sort by newest first
  alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({ success: true, data: alerts })
}
