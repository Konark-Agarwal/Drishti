import { Camera, Users, Package, Mic, Shield } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'Live Photo Verification',
    description: 'GPS, timestamp, and background analysis. No more recycled photos.',
  },
  {
    icon: Users,
    title: 'YOLO Proxy Detection',
    description: "AI counts faces in site photos. If the count doesn't match your labor report, we flag it.",
  },
  {
    icon: Package,
    title: 'Material Consumption Tracking',
    description: "We cross-reference your reported usage with the engineer's plan. If you're using less, we alert the owner.",
  },
  {
    icon: Mic,
    title: 'Voice Reporting',
    description: 'Speak in Hindi or English. We transcribe and analyze your update. Saves time, ensures accuracy.',
  },
  {
    icon: Shield,
    title: 'Aadhar Verification',
    description: 'Every professional is verified with government ID before they can apply.',
  },
]

export function AIFeatures() {
  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2">
        <div>
          <h2 className="mb-2 font-serif text-3xl font-bold text-[#0A1929] md:text-4xl text-balance">
            {"Meet Your AI Officer. It's Tougher Than Any Human Inspector."}
          </h2>
          <p className="mb-8 text-[#64748B]">
            Five layers of AI-powered verification ensure zero corruption on your construction site.
          </p>
          <div className="flex flex-col gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F97316]/10">
                  <f.icon className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <h4 className="mb-1 font-serif font-semibold text-[#1E293B]">{f.title}</h4>
                  <p className="text-sm leading-relaxed text-[#64748B]">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative flex h-80 w-80 items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-[#F97316]/30" style={{ animationDuration: '20s' }} />
            {/* Middle ring */}
            <div className="absolute inset-8 rounded-full border-2 border-[#3B82F6]/20" />
            {/* Inner shield */}
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#0A1929] shadow-2xl">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L6 12v12c0 11.11 7.67 21.47 18 24 10.33-2.53 18-12.89 18-24V12L24 4z" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2" />
                <circle cx="24" cy="22" r="6" fill="#F97316" />
                <path d="M24 16v12M18 22h12" stroke="#0A1929" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            {/* Scanning line */}
            <div
              className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-[#F97316]/40 to-transparent"
              style={{ animation: 'pulse 3s ease-in-out infinite' }}
            />
            {/* Floating badges */}
            <div className="absolute -right-4 top-12 rounded-lg bg-white p-2 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                <span className="text-[#1E293B]">GPS Verified</span>
              </div>
            </div>
            <div className="absolute -left-4 bottom-16 rounded-lg bg-white p-2 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="h-2 w-2 rounded-full bg-[#EF4444]" />
                <span className="text-[#1E293B]">Fraud Detected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
