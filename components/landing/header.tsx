// components/landing/header.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export function UtilityBar() {
  return (
    <div className="bg-[#0A1929] text-[#94A3B8] text-[0.75rem]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2">
        <span className="hidden sm:inline">🇮🇳 Government Infrastructure Monitoring Initiative — Rajasthan</span>
        <span className="sm:hidden">Govt. Infrastructure Monitoring</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="rounded-md border border-[#F97316] px-3 py-1 text-[#F97316] transition-colors hover:bg-[#F97316]/10"
            title="Owners: Start here."
          >
            📦 POST A PROJECT
          </button>
          <button
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="rounded-md border border-[#10B981] px-3 py-1 text-[#10B981] transition-colors hover:bg-[#10B981]/10"
          >
            ✍️ APPLY AS PROFESSIONAL
          </button>
          <span className="hidden text-[#64748B] sm:inline">EN | हिंदी</span>
        </div>
      </div>
    </div>
  )
}

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Eye className="h-6 w-6 text-[#0A1929]" />
          <span className="font-serif text-xl font-bold text-[#0A1929]">DRISHTI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {['Home', 'About Us', 'Features', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              className="relative text-sm text-[#1E293B] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#F97316] after:transition-all hover:after:w-full"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login?role=owner"
            className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm text-[#1E293B] transition-colors hover:border-[#F97316] hover:text-[#F97316]"
          >
            👤 Owner Login
          </Link>
          <Link
            href="/login?role=engineer"
            className="hidden rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm text-[#1E293B] transition-colors hover:border-[#3B82F6] hover:text-[#3B82F6] sm:block"
          >
            📐 Engineer Login
          </Link>
          <Link
            href="/login?role=contractor"
            className="hidden rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm text-[#1E293B] transition-colors hover:border-[#14B8A6] hover:text-[#14B8A6] sm:block"
          >
            ⛑️ Contractor Login
          </Link>
        </div>
      </div>
    </header>
  )
}