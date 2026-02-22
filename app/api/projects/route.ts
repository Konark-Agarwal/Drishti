import { NextResponse } from 'next/server'
import { mockProjects } from '@/lib/mock-data'
import type { Project } from '@/lib/mock-data'

// GET /api/projects - List all projects or filter by owner
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ownerEmail = searchParams.get('ownerEmail')
  const status = searchParams.get('status')

  let projects = mockProjects
  if (ownerEmail) projects = projects.filter((p) => p.ownerEmail === ownerEmail)
  if (status) projects = projects.filter((p) => p.status === status)

  return NextResponse.json({ success: true, data: projects })
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: body.name,
      location: body.location,
      budget: body.budget,
      startDate: body.startDate,
      endDate: body.endDate,
      ownerEmail: body.ownerEmail,
      status: 'on-track',
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      description: body.description,
      type: body.type,
    }

    // In production: Append to Google Sheets "Projects" tab
    return NextResponse.json({ success: true, data: newProject }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
