import { NextResponse } from 'next/server'

// POST /api/photos - Save photo metadata
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const photoRecord = {
      id: `photo-${Date.now()}`,
      projectId: body.projectId,
      uploadedByEmail: body.uploadedByEmail,
      uploaderRole: body.uploaderRole || 'contractor',
      imageUrl: body.imageUrl,
      gpsLat: body.gpsLat,
      gpsLng: body.gpsLng,
      timestamp: body.timestamp || new Date().toISOString(),
      deviceId: body.deviceId || 'unknown',
      aiVerified: null, // Pending AI analysis
      aiNotes: 'Pending AI verification...',
      voiceNoteUrl: body.voiceNoteUrl || null,
      materialLog: body.materialLog || [],
      reportedWorkerCount: body.reportedWorkerCount || 0,
      createdAt: new Date().toISOString(),
    }

    // In production: Append to Google Sheets "Photos" tab
    // Then trigger /api/photos/verify for AI analysis
    return NextResponse.json({ success: true, data: photoRecord }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to save photo' }, { status: 400 })
  }
}
