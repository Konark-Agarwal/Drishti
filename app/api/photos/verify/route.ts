// app/api/photos/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Mock project GPS coordinates
const projectGPS: Record<string, { lat: number; lng: number }> = {
  'proj-1': { lat: 26.9124, lng: 75.7873 },
  'proj-2': { lat: 24.5854, lng: 73.7125 },
}

// Mock plan data
const projectPlans: Record<string, any> = {
  'proj-1': { materials: { cement: 500, steel: 10, bricks: 25000, sand: 50 } },
  'proj-2': { materials: { cement: 800, steel: 20, bricks: 40000, sand: 80 } }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const projectId = formData.get('projectId') as string
    const gpsLat = parseFloat(formData.get('gpsLat') as string)
    const gpsLng = parseFloat(formData.get('gpsLng') as string)
    const reportedWorkerCount = parseInt(formData.get('reportedWorkerCount') as string)
    const materialLog = JSON.parse(formData.get('materialLog') as string || '[]')
    const photo = formData.get('photo') as Blob | null

    if (!projectId || !gpsLat || !gpsLng || !reportedWorkerCount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const alerts: any[] = []
    let aiVerified = true
    let aiNotes = ''

    // Step A: GPS Verification
    const projectCoords = projectGPS[projectId]
    if (projectCoords) {
      const distance = calculateDistance(gpsLat, gpsLng, projectCoords.lat, projectCoords.lng)
      if (distance > 100) { // meters
        alerts.push({
          severity: 'high',
          message: `FRAUD: GPS location mismatch! Photo GPS (${gpsLat.toFixed(4)}, ${gpsLng.toFixed(4)}) is ${distance.toFixed(0)}m from project site.`,
        })
        aiVerified = false
        aiNotes += 'GPS mismatch. '
      }
    }

    // Step B: Duplicate Image Detection (mock)
    const isDuplicate = Math.random() < 0.1 // 10% chance
    if (isDuplicate) {
      alerts.push({
        severity: 'high',
        message: 'FRAUD: Duplicate photo detected. Same image uploaded previously!',
      })
      aiVerified = false
      aiNotes += 'Duplicate image. '
    }

    // Step C: YOLO Proxy Detection (mock)
    const detectedWorkers = Math.floor(Math.random() * 20) + 1
    if (Math.abs(detectedWorkers - reportedWorkerCount) > 3) {
      if (detectedWorkers < reportedWorkerCount - 3) {
        alerts.push({
          severity: 'high',
          message: `FRAUD: Worker count mismatch! Reported ${reportedWorkerCount}, AI detected ${detectedWorkers}. Suspected proxy labor.`,
        })
        aiVerified = false
        aiNotes += 'Worker count mismatch. '
      } else if (detectedWorkers > reportedWorkerCount + 3) {
        alerts.push({
          severity: 'medium',
          message: `SUSPICIOUS: More workers detected (${detectedWorkers}) than reported (${reportedWorkerCount}). Possible unregistered labor.`,
        })
      }
    }

    // Step D: Material Consumption Analysis
    const plan = projectPlans[projectId]
    if (plan && materialLog.length > 0) {
      for (const item of materialLog) {
        const materialName = item.name.toLowerCase()
        const plannedQty = plan.materials[materialName]
        if (plannedQty) {
          // Mock total used so far
          const totalUsedSoFar = Math.floor(Math.random() * plannedQty * 1.2)
          if (totalUsedSoFar > plannedQty * 1.1) {
            alerts.push({
              severity: 'medium',
              message: `Material usage exceeds plan for ${item.name}. Possible theft or inaccurate reporting.`,
            })
          }
        }
      }
    }

    if (alerts.length === 0) {
      aiNotes = 'All checks passed. Photo verified.'
    } else {
      aiNotes = aiNotes.trim() || 'Issues detected.'
    }

    // Return analysis
    return NextResponse.json({
      aiVerified,
      aiNotes,
      alerts,
    })
  } catch (error) {
    console.error('AI verification error:', error)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}