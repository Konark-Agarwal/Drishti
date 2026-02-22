'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Home, Eye } from 'lucide-react'

interface DashboardShellProps {
  role: 'owner' | 'engineer' | 'contractor'
  userName: string
  children: React.ReactNode
}

const roleColors = {
  owner: '#F97316',
  engineer: '#3B82F6',
  contractor: '#14B8A6',
}

const roleLabels = {
  owner: 'Owner Dashboard',
  engineer: 'Engineer Dashboard',
  contractor: 'Contractor Dashboard',
}

export function DashboardShell({ role, userName, children }: DashboardShellProps) {
  const router = useRouter()
  const color = roleColors[role]

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Eye className="h-5 w-5" style={{ color }} />
              <span className="font-serif text-lg font-bold text-[#0A1929]">DRISHTI</span>
            </Link>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {roleLabels[role]}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[#64748B] sm:inline">
              Welcome, <span className="font-medium text-[#1E293B]">{userName}</span>
            </span>
            <Link
              href="/"
              className="rounded-lg p-2 text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#1E293B]"
            >
              <Home className="h-4 w-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm text-[#64748B] transition-colors hover:border-[#EF4444] hover:text-[#EF4444]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
