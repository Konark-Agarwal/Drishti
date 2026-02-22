import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#0A1929] text-[#94A3B8]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="14" cy="14" r="5" fill="#F97316" />
            </svg>
            <span className="font-serif text-lg font-bold text-white">DRISHTI</span>
          </div>
          <p className="text-sm leading-relaxed">Building trust with technology.</p>
        </div>
        <div>
          <h4 className="mb-4 font-serif text-sm font-semibold text-white">Platform</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/owner-dashboard" className="hover:text-[#F97316]">For Owners</Link></li>
            <li><Link href="/engineer-dashboard" className="hover:text-[#F97316]">For Engineers</Link></li>
            <li><Link href="/contractor-dashboard" className="hover:text-[#F97316]">For Contractors</Link></li>
            <li><a href="#" className="hover:text-[#F97316]">Features</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-serif text-sm font-semibold text-white">Company</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/about" className="hover:text-[#F97316]">About Us</Link></li>
            {/* <li><a href="#" className="hover:text-[#F97316]">Careers</a></li> */}
            {/* <li><a href="#" className="hover:text-[#F97316]">Blog</a></li> */}
            <li><a href="#" className="hover:text-[#F97316]">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-serif text-sm font-semibold text-white">Legal</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href="#" className="hover:text-[#F97316]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#F97316]">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[#64748B]">
        {'© 2025 Drishti. All rights reserved. A Digital India Initiative.'}
      </div>
    </footer>
  )
}
