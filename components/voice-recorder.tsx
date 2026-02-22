'use client'

import { useState, useRef } from 'react'
import { Mic, Square, Play, Trash2, Save, Loader2 } from 'lucide-react'

interface VoiceRecorderProps {
  onSave?: (audioBlob: Blob, transcript: string) => void
}

export function VoiceRecorder({ onSave }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [permission, setPermission] = useState<boolean | null>(null)

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const requestMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermission(true)
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        simulateTranscription(audioBlob)
        audioChunks.current = []
      }
    } catch (err) {
      setPermission(false)
    }
  }

  const simulateTranscription = (blob: Blob) => {
    setIsTranscribing(true)
    // Simulate transcription delay
    setTimeout(() => {
      const mockTranscripts = [
        "Foundation work is progressing well. We've poured 50 bags of cement today.",
        "Steel reinforcement is complete. Ready for next phase.",
        "Labor count is 12 today, all present.",
        "Material delivery delayed by 2 hours.",
        "All good on site. No issues.",
        "We're ahead of schedule by 2 days.",
        "Need more sand for tomorrow's pour.",
      ]
      const random = Math.floor(Math.random() * mockTranscripts.length)
      setTranscript(mockTranscripts[random])
      setIsTranscribing(false)
    }, 1500)
  }

  const startRecording = async () => {
    if (!permission) {
      await requestMicrophone()
    }
    if (mediaRecorder.current && mediaRecorder.current.state === 'inactive') {
      audioChunks.current = []
      mediaRecorder.current.start()
      setRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      setRecording(false)
    }
  }

  const clearRecording = () => {
    setAudioURL(null)
    setTranscript('')
    if (audioURL) URL.revokeObjectURL(audioURL)
  }

  const handleSave = () => {
    if (audioURL && transcript && onSave) {
      // Convert audioURL to blob
      fetch(audioURL)
        .then(r => r.blob())
        .then(blob => onSave(blob, transcript))
        .catch(console.error)
    }
  }

  if (permission === false) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        Microphone access denied. Please enable it in your browser settings.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <h3 className="mb-3 text-sm font-medium text-[#1E293B]">Voice Update</h3>
      <div className="flex items-center gap-3">
        {!recording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm text-white hover:bg-[#2563EB] disabled:opacity-50"
            disabled={recording}
          >
            <Mic className="h-4 w-4" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            <Square className="h-4 w-4" />
            Stop Recording
          </button>
        )}
      </div>

      {isTranscribing && (
        <div className="mt-3 flex items-center gap-2 text-sm text-[#64748B]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Transcribing...
        </div>
      )}

      {transcript && (
        <div className="mt-3 rounded-lg border border-[#E2E8F0] bg-white p-3">
          <p className="text-sm text-[#1E293B]">{transcript}</p>
        </div>
      )}

      {audioURL && (
        <div className="mt-3 flex items-center gap-3">
          <audio src={audioURL} controls className="h-8 max-w-[200px]" />
          <button
            onClick={clearRecording}
            className="text-[#64748B] hover:text-[#EF4444]"
            title="Discard"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 text-sm text-[#3B82F6] hover:text-[#2563EB]"
            disabled={!transcript}
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      )}
    </div>
  )
}