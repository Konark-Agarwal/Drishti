import { NextResponse } from 'next/server'

// PATCH /api/applications/[id] - Accept or reject an application
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body // 'accepted' | 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Status must be accepted or rejected' }, { status: 400 })
    }

    // In production: Update Google Sheets "Applications" tab where id matches
    return NextResponse.json({
      success: true,
      data: { id, status, updatedAt: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
