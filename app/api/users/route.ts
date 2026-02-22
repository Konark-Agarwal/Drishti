import { NextResponse } from 'next/server'
import { mockUsers } from '@/lib/mock-data'
import type { User } from '@/lib/mock-data'

// GET /api/users - List all users or filter by role
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')

  let users = mockUsers
  if (role) {
    users = users.filter((u) => u.role === role)
  }

  return NextResponse.json({ success: true, data: users })
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: body.email,
      name: body.name,
      role: body.role,
      verified: false,
      createdAt: new Date().toISOString(),
    }

    // In production: Append to Google Sheets "Users" tab
    // For hackathon: Return mock success
    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
