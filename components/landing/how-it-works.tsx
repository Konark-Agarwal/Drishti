import { Home, PenTool, HardHat } from 'lucide-react'

const roles = [
  {
    icon: Home,
    title: '1. The Project Owner',
    description:
      'Post your project, set a budget, and timeline. Get applications from pre-vetted engineers and contractors. Monitor everything live on your dashboard.',
    badge: 'Avg. Savings: 18%',
    color: '#F97316',
  },
  {
    icon: PenTool,
    title: '2. The Civil Engineer',
    description:
      'Get verified with your license and Aadhar. Browse projects, submit tenders, and create detailed material roadmaps. Monitor contractor work and report progress via voice.',
    badge: '200+ Projects Listed',
    color: '#3B82F6',
  },
  {
    icon: HardHat,
    title: '3. The Contractor',
    description:
      'Get verified and get hired. Upload daily progress using our Live Camera (no gallery photos!). Speak your updates. Our AI verifies your work and protects your reputation.',
    badge: 'Zero Tolerance for Proxy',
    color: '#14B8A6',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center font-serif text-3xl font-bold text-[#0A1929] md:text-4xl text-balance">
          Your All-in-One Construction Companion
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-[#64748B]">
          Three roles, one platform. Drishti brings everyone together with transparency at its core.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.title}
              className="group rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] transition-shadow hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)]"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${role.color}15` }}
              >
                <role.icon className="h-6 w-6" style={{ color: role.color }} />
              </div>
              <h3 className="mb-3 font-serif text-xl font-semibold text-[#1E293B]">{role.title}</h3>
              <p className="mb-4 leading-relaxed text-[#64748B]">{role.description}</p>
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: `${role.color}15`, color: role.color }}
              >
                {role.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
