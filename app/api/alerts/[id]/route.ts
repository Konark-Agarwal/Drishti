import { NextResponse } from 'next/server'

// PATCH /api/alerts/[id] - Resolve an alert
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // In production: Update Google Sheets "Alerts" tab where id matches
    return NextResponse.json({
      success: true,
      data: {
        id,
        resolved: body.resolved ?? true,
        resolvedAt: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update alert' }, { status: 400 })
  }
}
