'use client'

import { addPhoto } from '@/lib/photos-store'
import { addAlert } from '@/lib/alerts-store'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Mic, Plus, Trash2, MapPin, Clock, Send, Square, Play, Pause, X } from 'lucide-react'
import { toast } from 'sonner'
import { addMaterialLog } from '@/lib/material-logs-store'
import { DashboardShell } from '@/components/dashboard-shell'
import { mockProjects, mockApplications, formatINR } from '@/lib/mock-data'
interface MaterialEntry {
  name: string
  quantity: string
  unit: string
}

export default function ContractorDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'available' | 'active'>('active')
  const [userName, setUserName] = useState('Contractor')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/'); return }
    const user = JSON.parse(stored)
    if (user.role !== 'contractor') { router.push('/'); return }
    setUserName(user.name || 'Contractor')
    setUserEmail(user.email)
  }, [router])

  const acceptedApplications = mockApplications.filter(
    (a) => a.applicantEmail === 'contractor@demo.com' && a.status === 'accepted'
  )
  const activeProjectIds = acceptedApplications.map((a) => a.projectId)
  const activeProjects = mockProjects.filter((p) => activeProjectIds.includes(p.id))
  const availableProjects = mockProjects.filter((p) => !activeProjectIds.includes(p.id))

  return (
    <DashboardShell role="contractor" userName={userName}>
      {/* Tabs */}
      <div className="mb-6 flex w-fit gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1">
        <button
          onClick={() => setActiveTab('available')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'available' ? 'bg-[#14B8A6] text-white' : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          Available Projects
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'active' ? 'bg-[#14B8A6] text-white' : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          My Active Projects
        </button>
      </div>

      {activeTab === 'available' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableProjects.length === 0 && (
            <p className="col-span-full text-center text-[#64748B]">No available projects at this time.</p>
          )}
          {availableProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]"
            >
              <h3 className="mb-2 font-serif text-lg font-semibold text-[#1E293B]">{project.name}</h3>
              <p className="mb-2 text-sm text-[#64748B]">{project.location}</p>
              <p className="mb-4 text-sm text-[#64748B]">Budget: {formatINR(project.budget)}</p>
              <button
                onClick={() => toast.success('Application sent!')}
                className="w-full rounded-lg bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D9488]"
              >
                Apply for Project
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {activeProjects.map((project) => (
            <DailyProgressUpload key={project.id} project={project} userEmail={userEmail} />
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

function DailyProgressUpload({ project, userEmail }: { project: typeof mockProjects[0]; userEmail: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null)
  
  // Voice states
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [voicePermission, setVoicePermission] = useState<boolean | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [materials, setMaterials] = useState<MaterialEntry[]>([{ name: 'Cement', quantity: '', unit: 'Bags' }])
  const [workerCount, setWorkerCount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    mediaRecorder.current = new MediaRecorder(stream)
    audioChunks.current = []

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data)
    }

    mediaRecorder.current.start()
    setRecording(true)
    setRecordingTime(0)

    recordingInterval.current = setInterval(() => {
      setRecordingTime((t) => t + 1)
    }, 1000)

  } catch (err) {
    toast.error('Microphone access denied.')
  }
}


const stopRecording = () => {
  if (!mediaRecorder.current) return

  mediaRecorder.current.stop()
  setRecording(false)

  if (recordingInterval.current) {
    clearInterval(recordingInterval.current)
  }

  mediaRecorder.current.onstop = async () => {
    const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
    const url = URL.createObjectURL(blob)

    setAudioBlob(blob)
    setAudioUrl(url)

    // 🔥 REAL ELEVENLABS TRANSCRIBE
    const formData = new FormData()
    formData.append('file', blob, 'audio.webm')

    const res = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    setTranscription(data.text || 'No transcript returned')
  }
}

  const openCamera = useCallback(async () => {
  try {
    // 1️⃣ Mount the video element first
    setCameraOpen(true)

    // 2️⃣ Wait one frame so React renders <video>
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve())
    )

    // 3️⃣ Request camera stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' }, // back camera preferred
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    })

    const video = videoRef.current
    if (!video) {
      // If for some reason video isn't mounted, stop stream
      stream.getTracks().forEach(track => track.stop())
      return
    }

    // 4️⃣ Attach stream
    video.srcObject = stream
    video.setAttribute('playsinline', 'true') // iOS fix
    video.muted = true

    // 5️⃣ Wait until enough data is available
    await new Promise<void>((resolve, reject) => {
      const handleLoaded = () => {
        if (video.readyState >= 2) {
          resolve()
        }
      }

      video.onloadeddata = handleLoaded
      video.onerror = () => reject()
    })

    // 6️⃣ Play safely
    await video.play()

  } catch (err) {
    console.error('Camera error:', err)
    toast.error('Camera access required.')
    setCameraOpen(false)
  }
}, [])

  const capturePhoto = () => {
  const video = videoRef.current
  const canvas = canvasRef.current

  if (!video || !canvas) return

  // 🚀 Strong readiness check
  if (video.readyState !== 4) {
    toast.error('Camera initializing... Please wait 1 second.')
    return
  }

  const width = video.videoWidth
  const height = video.videoHeight

  if (!width || !height) {
    toast.error('Camera frame not ready.')
    return
  }

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(video, 0, 0, width, height)

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  setCapturedPhoto(dataUrl)

  // Stop camera stream safely
  const stream = video.srcObject as MediaStream
  stream?.getTracks().forEach(track => track.stop())

  video.srcObject = null
  setCameraOpen(false)

  // fallback GPS
  if (!gpsLocation) {
    setGpsLocation({ lat: 26.9124, lng: 75.7873 })
  }
}

  const retakePhoto = () => {
  setCapturedPhoto(null)
  openCamera()
}

  // Voice functions
  
  const togglePlayback = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const clearVoice = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription('')
    setIsPlaying(false)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Material handlers
  const addMaterial = () => setMaterials([...materials, { name: '', quantity: '', unit: 'Bags' }])
  const removeMaterial = (index: number) => setMaterials(materials.filter((_, i) => i !== index))
  const updateMaterial = (index: number, field: keyof MaterialEntry, value: string) => {
    const updated = [...materials]
    updated[index] = { ...updated[index], [field]: value }
    setMaterials(updated)
  }

  const handleSubmit = async () => {
    if (!capturedPhoto) {
      toast.error('Please capture a live photo first.')
      return
    }
    if (!workerCount) {
      toast.error('Please enter the worker count.')
      return
    }
    setSubmitting(true)

    try {
      const photoBlob = await fetch(capturedPhoto).then(res => res.blob())
      const formData = new FormData()
      formData.append('projectId', project.id)
      formData.append('photo', photoBlob, 'photo.jpg')
      formData.append('gpsLat', (gpsLocation?.lat || 26.9124).toString())
      formData.append('gpsLng', (gpsLocation?.lng || 75.7873).toString())
      formData.append('reportedWorkerCount', workerCount)
      formData.append('materialLog', JSON.stringify(materials.filter(m => m.name && m.quantity)))

      if (audioBlob) {
        formData.append('voice', audioBlob, 'voice.webm')
        formData.append('transcript', transcription)
      }

      const response = await fetch('/api/photos/verify', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Verification failed')
      const result = await response.json()

      // Store alerts
      if (result.alerts && result.alerts.length > 0) {
        result.alerts.forEach((alert: any) => {
          addAlert({
            projectId: project.id,
            message: alert.message,
            severity: alert.severity,
          })
        })
      }

      // Store photo
      addPhoto({
        projectId: project.id,
        uploadedByEmail: userEmail,
        uploaderRole: 'contractor',
        url: capturedPhoto,
        imageUrl: capturedPhoto,
        gpsLat: gpsLocation?.lat || 26.9124,
        gpsLng: gpsLocation?.lng || 75.7873,
        timestamp: new Date().toISOString(),
        deviceId: 'device-contractor',
        aiVerified: result.aiVerified,
        aiNotes: result.aiNotes,
        materialLog: materials
          .filter(m => m.name && m.quantity)
          .map(m => ({
            name: m.name,
            quantity: parseInt(m.quantity) || 0,
            unit: m.unit
          })),
        reportedWorkerCount: parseInt(workerCount) || 0,
      })

      materials.filter(m => m.name && m.quantity).forEach(m => {
  addMaterialLog({
    projectId: project.id,
    reportedByEmail: userEmail,
    materialName: m.name,
    quantityUsed: parseInt(m.quantity) || 0,
    unit: m.unit,
  })
})


      if (result.aiVerified) {
        toast.success(`AI Officer: ${result.aiNotes}`)
      } else {
        toast.warning(`AI Officer flagged issues: ${result.aiNotes}`)
      }

      // Reset form
      setCapturedPhoto(null)
      setAudioBlob(null)
      setAudioUrl(null)
      setTranscription('')
      setMaterials([{ name: 'Cement', quantity: '', unit: 'Bags' }])
      setWorkerCount('')
      setGpsLocation(null)
    } catch (error) {
      toast.error('Failed to submit report. Please try again.')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
      <h2 className="mb-1 font-serif text-lg font-semibold text-[#0A1929]">{"Upload Today's Progress"}</h2>
      <p className="mb-6 text-sm text-[#64748B]">
        Project: <span className="font-medium text-[#1E293B]">{project.name}</span>
      </p>

      {/* Step 1: Live Photo Capture */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#14B8A6] text-xs text-white">1</span>
          Live Photo Capture
        </h3>

        {!capturedPhoto && !cameraOpen && (
          <button
            onClick={openCamera}
            className="flex items-center gap-2 rounded-lg bg-[#14B8A6] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0D9488]"
          >
            <Camera className="h-5 w-5" />
            OPEN LIVE CAMERA
          </button>
        )}

        {cameraOpen && (
          <div className="relative overflow-hidden rounded-xl border border-[#E2E8F0]">
            <video ref={videoRef} className="w-full" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button
  onClick={capturePhoto}
  disabled={!videoRef.current || videoRef.current.readyState !== 4}
  className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-lg transition-transform hover:scale-105 ${
    videoRef.current && videoRef.current.readyState === 4
      ? 'bg-[#EF4444]'
      : 'bg-gray-400 cursor-not-allowed'
  }`}
>
                <div className="h-5 w-5 rounded-full bg-white" />
              </button>
            </div>
            {cameraOpen &&
 (!videoRef.current || videoRef.current.readyState !== 4) && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
    <p className="text-white">Initializing camera...</p>
  </div>
)}
          </div>
        )}

        {capturedPhoto && (
          <div className="relative">
            <img src={capturedPhoto} alt="Captured site photo" className="w-full max-w-md rounded-xl border border-[#E2E8F0]" />
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#10B981]" />
                GPS: {gpsLocation ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}` : 'Capturing...'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#3B82F6]" />
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={retakePhoto}
                className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Retake
              </button>
              <button
                onClick={() => setCapturedPhoto(null)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Voice Update */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#14B8A6] text-xs text-white">2</span>
          Voice Update (Optional)
        </h3>

        {!audioBlob && !recording && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm text-[#1E293B] hover:border-[#14B8A6] hover:text-[#14B8A6]"
          >
            <Mic className="h-4 w-4" />
            ADD VOICE NOTE
          </button>
        )}

        {recording && (
          <div className="flex items-center gap-4">
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 rounded-lg bg-[#EF4444] px-4 py-2.5 text-sm text-white hover:bg-[#DC2626]"
            >
              <Square className="h-4 w-4" />
              Stop Recording ({formatTime(recordingTime)})
            </button>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-[#EF4444]" />
              <span className="text-sm text-[#EF4444]">Recording...</span>
            </div>
          </div>
        )}

        {audioBlob && audioUrl && (
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="mb-2 flex items-center gap-3">
              <button
                onClick={togglePlayback}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14B8A6] text-white"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
              </button>
              <div className="flex-1">
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                <div className="h-1.5 rounded-full bg-[#E2E8F0]">
                  <div className="h-1.5 w-0 rounded-full bg-[#14B8A6]" />
                </div>
              </div>
              <span className="text-xs text-[#64748B]">{formatTime(recordingTime)}</span>
              <button onClick={clearVoice} className="text-[#64748B] hover:text-[#EF4444]">
                <X className="h-4 w-4" />
              </button>
            </div>
            {transcription && (
              <div className="mt-2 rounded-lg bg-white p-3 text-sm text-[#1E293B]">
                <span className="text-xs font-medium text-[#64748B]">Transcribed: </span>
                {transcription}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 3: Materials Used Today */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#14B8A6] text-xs text-white">3</span>
          Materials Used Today
        </h3>

        <div className="flex flex-col gap-3">
          {materials.map((mat, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <select
                value={mat.name}
                onChange={(e) => updateMaterial(i, 'name', e.target.value)}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50"
              >
                <option value="">Select Material</option>
                <option value="Cement">Cement</option>
                <option value="Steel">Steel</option>
                <option value="Bricks">Bricks</option>
                <option value="Sand">Sand</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                value={mat.quantity}
                onChange={(e) => updateMaterial(i, 'quantity', e.target.value)}
                placeholder="Qty"
                className="w-24 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50"
              />
              <select
                value={mat.unit}
                onChange={(e) => updateMaterial(i, 'unit', e.target.value)}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50"
              >
                <option>Bags</option>
                <option>Kg</option>
                <option>Tons</option>
                <option>Units</option>
              </select>
              {materials.length > 1 && (
                <button onClick={() => removeMaterial(i)} className="text-[#EF4444] hover:text-[#DC2626]">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addMaterial}
            className="flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-[#E2E8F0] px-3 py-2 text-sm text-[#64748B] hover:border-[#14B8A6] hover:text-[#14B8A6]"
          >
            <Plus className="h-4 w-4" />
            Add Material
          </button>
        </div>
      </div>

      {/* Step 4: Labor Count */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#14B8A6] text-xs text-white">4</span>
          Labor Count
        </h3>
        <input
          type="number"
          value={workerCount}
          onChange={(e) => setWorkerCount(e.target.value)}
          placeholder="Total workers on site today"
          className="w-full max-w-xs rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14B8A6] px-8 py-3.5 font-semibold text-white transition-colors hover:bg-[#0D9488] disabled:opacity-60 md:w-auto"
      >
        <Send className="h-5 w-5" />
        {submitting ? 'Submitting...' : 'SUBMIT DAILY REPORT TO AI OFFICER'}
      </button>
    </div>
  )
}