// app/page.tsx
import { UtilityBar, MainHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero'
import { StatsBar } from '@/components/landing/stats-bar'
import { HowItWorks } from '@/components/landing/how-it-works'
import { AIFeatures } from '@/components/landing/ai-features'
import { GetStartedForm } from '@/components/landing/get-started-form'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <UtilityBar />
      <MainHeader />
      <main>
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <AIFeatures />
        {/* <GetStartedForm /> */}
      </main>
      <Footer />
    </div>
  )
}