'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const alerts = [
  { time: '12:32 PM', icon: 'check', text: 'Photo Verified: Foundation photo matches GPS.', tag: 'Contractor', color: 'text-[#10B981]' },
  { time: '12:15 PM', icon: 'warn', text: 'FRAUD ALERT: Face count mismatch! Reported 12 workers, AI detected 5.', tag: 'High Severity', color: 'text-[#EF4444]' },
  { time: '11:50 AM', icon: 'voice', text: 'Voice Update: "Cement pour done. 50 bags used."', tag: 'Contractor', color: 'text-[#3B82F6]' },
  { time: '11:30 AM', icon: 'check', text: 'GPS location verified for site photo upload.', tag: 'System', color: 'text-[#10B981]' },
  { time: '11:10 AM', icon: 'warn', text: 'Material usage 15% above plan for Steel.', tag: 'Medium', color: 'text-[#F59E0B]' },
]

export function HeroSection() {
  const router = useRouter()
  const [visibleAlerts, setVisibleAlerts] = useState<number[]>([])

  useEffect(() => {
    const timers = alerts.map((_, i) =>
      setTimeout(() => {
        setVisibleAlerts((prev) => [...prev, i])
      }, 800 * (i + 1))
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1929] via-[#0A1929]/70 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#F97316]/10 px-4 py-2 text-sm text-[#F97316]">
            ⚡ Powered by AI · Zero Corruption
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
            Build Your Dream.
          </h1>
          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
            We Have an <span className="text-[#F97316]">AI Officer</span> Watching Your Back.
          </h1>
          <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#94A3B8]">
            Drishti connects you with government-verified engineers and contractors. Our AI tracks
            every brick, verifies every photo with GPS, and alerts you the moment something is wrong.
          </p>
          <button
            onClick={() => {
              localStorage.setItem('user', JSON.stringify({ email: 'owner@demo.com', role: 'owner', name: 'Rajesh Sharma' }))
              router.push('/owner-dashboard')
            }}
            className="w-fit rounded-lg bg-[#F97316] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            Start Your Project — It's Free
          </button>
        </div>

        <div className="flex items-center justify-center">
  <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
    <div className="mb-4 flex items-center gap-2">
      <div className="h-3 w-3 animate-pulse rounded-full bg-[#10B981]" />
      <h3 className="font-serif text-sm font-semibold text-[#0A1929]">Live AI Officer Report</h3>
    </div>
    <div className="flex flex-col gap-3">
      {alerts.map((alert, i) => {
        // Determine background color based on tag
        let bgColor = ''
        let textColor = ''
        if (alert.tag === 'High Severity') {
          bgColor = 'bg-[#EF4444]/10'
          textColor = 'text-[#EF4444]'
        } else if (alert.tag === 'Medium') {
          bgColor = 'bg-[#F59E0B]/10'
          textColor = 'text-[#F59E0B]'
        } else if (alert.tag === 'Contractor') {
          bgColor = 'bg-[#14B8A6]/10'
          textColor = 'text-[#14B8A6]'
        } else if (alert.tag === 'System') {
          bgColor = 'bg-[#10B981]/10'
          textColor = 'text-[#10B981]'
        } else {
          bgColor = 'bg-[#F8FAFC]' // default off-white
          textColor = 'text-[#1E293B]'
        }

        return (
          <div
            key={i}
            className={`rounded-lg p-3 transition-all duration-500 ${bgColor} ${
              visibleAlerts.includes(i) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="mb-1 flex items-center gap-2 text-xs text-[#64748B]">
              <span>[{alert.time}]</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${bgColor} ${textColor}`}
              >
                {alert.tag}
              </span>
            </div>
            <p className={`text-sm ${textColor}`}>{alert.text}</p>
          </div>
        )
      })}
    </div>
  </div>
</div>
      </div>
    </section>
  )
}