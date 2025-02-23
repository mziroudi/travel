import { LandingHero } from "@/components/landing/LandingHero"
import { AuroraBackground } from "@/components/ui/aurora-background"

export default function Home() {
  return (
    <AuroraBackground>
      <main className="min-h-screen">
        <LandingHero />
      </main>
    </AuroraBackground>
  )
} 