import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { UrlAnalyzer } from "@/components/url-analyzer"
import { AboutSection } from "@/components/about-section"
import { SecurityFeatures } from "@/components/security-features"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroCarousel />
          <div className="container mx-auto px-4 pb-8">
            <UrlAnalyzer />
          </div>
          <AboutSection />
          <SecurityFeatures />
          <FaqSection />
          <ContactSection />
        </main>
        <footer className="bg-muted/50 py-8 text-center text-muted-foreground">
          <div className="container mx-auto px-4">
            <p>&copy; 2025 BreachIndex. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}
