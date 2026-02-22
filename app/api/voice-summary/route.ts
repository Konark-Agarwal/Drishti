import { NextResponse } from 'next/server'
import { mockAlerts, mockProjects } from '@/lib/mock-data'

/**
 * POST /api/voice-summary - Generate a voice summary for a project
 *
 * Input: { projectId }
 * Output: A text summary of the project's current status
 *
 * In production: This would call /api/speak (ElevenLabs) to convert to audio.
 * For hackathon: Returns a text summary.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId } = body

    const project = mockProjects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    const projectAlerts = mockAlerts.filter((a) => a.projectId === projectId && !a.resolved)
    const highAlerts = projectAlerts.filter((a) => a.severity === 'high')

    // Generate text summary
    let summary = `Good evening. Project ${project.name} is ${project.progressPercent}% complete. `

    if (projectAlerts.length > 0) {
      summary += `You have ${projectAlerts.length} new alert${projectAlerts.length > 1 ? 's' : ''}. `
      if (highAlerts.length > 0) {
        summary += `The most critical is: ${highAlerts[0].message.substring(0, 100)}. `
      }
    } else {
      summary += 'No new alerts. Everything is on track. '
    }

    summary += 'Material consumption is within acceptable range.'

    // In production: Call ElevenLabs API to generate audio
    // const audioResponse = await fetch('/api/speak', { method: 'POST', body: JSON.stringify({ text: summary }) })

    return NextResponse.json({
      success: true,
      data: {
        summary,
        projectId,
        alertCount: projectAlerts.length,
        highAlertCount: highAlerts.length,
        // audioUrl: audioResponse.audioUrl // In production
        audioUrl: null,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to generate summary' }, { status: 500 })
  }
}
