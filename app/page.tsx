"use client"

import Navbar from "@/components/navigation/navbar"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { CoursesSection } from "@/components/sections/courses-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { StatsSection } from "@/components/sections/stats-section"
import { Footer } from "@/components/sections/footer"
import { SimpleFloatingToggle } from "@/components/ui/floating-theme-toggle"
import { ThemeTransition } from "@/contexts/extended-theme-context"
import { ThemeShowcase } from "@/components/ui/theme-showcase"

export default function Home() {
  return (
    <ThemeTransition>
      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <ThemeShowcase />
        <CoursesSection />
        <TestimonialsSection />
        <StatsSection />
        <Footer />
        
        {/* Floating Theme Toggle */}
        <SimpleFloatingToggle position="bottom-right" />
      </main>
    </ThemeTransition>
  )
}