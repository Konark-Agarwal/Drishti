'use client'

import { HardHat, Users, Shield, Mic } from 'lucide-react'
import { useCountUp } from '@/hooks/use-count-up'

function StatItem({ icon: Icon, value, suffix, label }: { icon: typeof HardHat; value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value)
  return (
    <div ref={ref} className="flex flex-col items-center gap-2 py-8 text-center">
      <Icon className="mb-1 h-8 w-8 text-[#F97316]" />
      <span className="font-serif text-3xl font-bold text-[#0A1929]">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-[#64748B]">{label}</span>
    </div>
  )
}

export function StatsBar() {
  return (
    <section className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
        <StatItem icon={HardHat} value={150} suffix="+" label="Active Projects" />
        <StatItem icon={Users} value={2500} suffix="+" label="Verified Professionals" />
        <StatItem icon={Shield} value={50} suffix="Cr+" label="Protected from Fraud" />
        <StatItem icon={Mic} value={10000} suffix="+" label="Voice Reports Processed" />
      </div>
    </section>
  )
}
