'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Camera, MapPin, Clock, XCircle, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface LiveCameraCaptureProps {
  projectId: string
  onCapture?: (photoData: {
    imageBlob: Blob
    gpsLat: number
    gpsLng: number
    timestamp: string
  }) => void
}

export function LiveCameraCapture({ projectId, onCapture }: LiveCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [permission, setPermission] = useState<boolean | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState<string>('')
  const [isCapturing, setIsCapturing] = useState(false)

  // Start camera
  const startCamera = useCallback(async () => {
    setVideoReady(false)
  setError(null)

  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })

    setStream(mediaStream)
    setPermission(true)

    // Wait for video element to mount
    await new Promise(requestAnimationFrame)

    const video = videoRef.current
    if (!video) return

video.srcObject = mediaStream
video.setAttribute('playsinline', 'true')
video.muted = true

video.onloadeddata = () => {
  setVideoReady(true)   // ✅ THIS IS WHAT YOU WERE MISSING
}

await video.play()
  } catch (err: any) {
    console.error('Camera error:', err)
    setPermission(false)
    setError(err.message || 'Failed to access camera')
  }
}, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [stream])

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // Get GPS location
  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  // Capture photo
  const capturePhoto = async () => {
    if (
  !videoRef.current ||
  !canvasRef.current ||
  !stream ||
  videoRef.current.readyState !== 4
) {
  setError('Video stream not ready')
  return
}

    setIsCapturing(true)
    setError(null)
    try {
      // Get GPS (best effort)
      let coords = null
      try {
        coords = await getLocation()
        setGpsCoords(coords)
        setGpsError(null)
      } catch (err: any) {
        setGpsError(err.message || 'GPS failed')
      }

      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageDataUrl = canvas.toDataURL('image/jpeg')
      setCapturedImage(imageDataUrl)

      canvas.toBlob((blob) => {
        if (blob && onCapture) {
          const now = new Date().toISOString()
          setTimestamp(now)
          onCapture({
            imageBlob: blob,
            gpsLat: coords?.lat || 0,
            gpsLng: coords?.lng || 0,
            timestamp: now,
          })
        }
      }, 'image/jpeg', 0.9)
    } catch (err: any) {
      console.error('Capture error:', err)
      setError(err.message || 'Capture failed')
    } finally {
      setIsCapturing(false)
    }
  }

  // Discard photo
  const discardPhoto = () => {
    setCapturedImage(null)
    setGpsCoords(null)
    setTimestamp('')
    setError(null)
  }

  // Save and close
  const handleSave = () => {
    toast.success('Photo saved to project gallery (demo)')
    discardPhoto()
    stopCamera()
  }

  if (permission === false || error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error || 'Camera access denied. Please enable it in your browser settings.'}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
      <h3 className="mb-3 text-sm font-medium text-[#1E293B]">Live Site Photo</h3>

      {!stream && !capturedImage && (
        <button
          onClick={startCamera}
          className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm text-white hover:bg-[#2563EB]"
        >
          <Camera className="h-4 w-4" />
          Open Live Camera
        </button>
      )}

      {stream && !capturedImage && (
        <div>
          <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
{stream && !videoReady && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
    <Loader2 className="h-8 w-8 animate-spin text-white" />
  </div>
)}
</div>
          <div className="flex gap-2">
            <button
              onClick={capturePhoto}
              disabled={isCapturing}
              className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm text-white hover:bg-[#2563EB] disabled:opacity-50"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Capturing...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  Capture Photo
                </>
              )}
            </button>
            <button
              onClick={stopCamera}
              className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#64748B] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div>
          <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-black">
            <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
          </div>

          <div className="mb-3 space-y-1 rounded-lg bg-[#F8FAFC] p-3 text-xs">
            <div className="flex items-center gap-2 text-[#64748B]">
              <MapPin className="h-3.5 w-3.5" />
              {gpsCoords ? (
                <span>
                  {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}
                </span>
              ) : (
                <span className="text-yellow-600">GPS unavailable</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#64748B]">
              <Clock className="h-3.5 w-3.5" />
              {timestamp ? new Date(timestamp).toLocaleString() : '--'}
            </div>
            {gpsError && (
              <div className="text-red-500">GPS error: {gpsError}</div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={discardPhoto}
              className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#64748B] hover:bg-[#F8FAFC]"
            >
              <XCircle className="h-4 w-4" />
              Discard
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm text-white hover:bg-[#2563EB]"
            >
              <Save className="h-4 w-4" />
              Save Photo
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}