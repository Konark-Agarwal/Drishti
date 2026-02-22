'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, Briefcase, HardHat, Users } from 'lucide-react'

type Role = 'owner' | 'engineer' | 'contractor'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role') as Role | null

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<Role>(roleParam || 'owner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // Update role when query param changes
  useEffect(() => {
    if (roleParam) setRole(roleParam)
  }, [roleParam])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (mode === 'login') {
        // For demo, accept any credentials and use mock user data
        const mockUser = {
          email,
          name: email.split('@')[0] || 'User',
          role,
          verified: role === 'owner', // owners are considered verified; professionals are not yet
        }
        localStorage.setItem('user', JSON.stringify(mockUser))

        // Redirect based on role
        if (role === 'owner') {
          router.push('/owner-dashboard')
        } else {
          // Engineer or contractor goes to verification page
          router.push('/verify')
        }
      } else {
        // Registration – create new user (not verified)
        const newUser = {
          email,
          name,
          role,
          verified: false,
        }
        localStorage.setItem('user', JSON.stringify(newUser))

        // Redirect professionals to verification, owners to dashboard
        if (role === 'owner') {
          router.push('/owner-dashboard')
        } else {
          router.push('/verify')
        }
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
            <Eye className="h-10 w-10 text-[#F97316]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0A1929]">Welcome to Drishti</h1>
          <p className="text-sm text-[#64748B]">Sign in or create your account</p>
        </div>

        {/* Mode Tabs */}
        <div className="mb-6 flex rounded-lg bg-[#F8FAFC] p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-white text-[#F97316] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'register' ? 'bg-white text-[#F97316] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="mb-2 block text-sm text-[#64748B]">I am a</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                role === 'owner'
                  ? 'border-[#F97316] bg-[#F97316]/5 text-[#F97316]'
                  : 'border-[#E2E8F0] text-[#64748B] hover:border-[#F97316] hover:text-[#F97316]'
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-xs">Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('engineer')}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                role === 'engineer'
                  ? 'border-[#3B82F6] bg-[#3B82F6]/5 text-[#3B82F6]'
                  : 'border-[#E2E8F0] text-[#64748B] hover:border-[#3B82F6] hover:text-[#3B82F6]'
              }`}
            >
              <HardHat className="h-5 w-5" />
              <span className="text-xs">Engineer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('contractor')}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                role === 'contractor'
                  ? 'border-[#14B8A6] bg-[#14B8A6]/5 text-[#14B8A6]'
                  : 'border-[#E2E8F0] text-[#64748B] hover:border-[#14B8A6] hover:text-[#14B8A6]'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">Contractor</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm text-[#64748B]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm text-[#64748B]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
          </div>

          {/* Registration-only fields */}
          {mode === 'register' && (
            <div>
              <label className="mb-1.5 block text-sm text-[#64748B]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#F97316] px-4 py-3 font-medium text-white transition-colors hover:bg-[#EA580C] disabled:opacity-60"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#94A3B8]">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-[#F97316] hover:underline">Terms</Link> and{' '}
          <Link href="/privacy" className="text-[#F97316] hover:underline">Privacy Policy</Link>.
        </p>
        <p className="mt-2 text-center text-xs text-[#94A3B8]">
          Demo: any email/password works.
        </p>
      </div>
    </div>
  )
}