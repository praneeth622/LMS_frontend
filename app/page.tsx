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
      <main className="min-h-screen overflow-x-hidden bg-background">
        <Navbar />
        
        {/* Hero Section with enhanced spacing and visual separation */}
        <div className="relative">
          <HeroSection />
          {/* Enhanced gradient divider with subtle pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-background/80 to-background">
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-2 bg-primary/30 rounded-full"></div>
              <div className="w-2 h-2 bg-primary/20 rounded-full"></div>
              <div className="w-2 h-2 bg-primary/10 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Main content sections with enhanced spacing and visual rhythm */}
        <div className="relative">
          {/* Features Section with improved container */}
          <div className="relative py-16 lg:py-24">
            <FeaturesSection />
            {/* Section separator with enhanced design */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary/15 to-transparent rounded-full" />
          </div>
          
          {/* Theme Showcase with spacing improvements */}
          <div className="relative py-16 lg:py-24 bg-gradient-to-b from-background via-muted/5 to-background">
            <ThemeShowcase />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent rounded-full" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-accent/15 to-transparent rounded-full" />
          </div>
          
          {/* Courses Section with enhanced background */}
          <div className="relative py-16 lg:py-24">
            <CoursesSection />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary/15 to-transparent rounded-full" />
          </div>
          
          {/* Testimonials Section with alternating background */}
          <div className="relative py-16 lg:py-24 bg-gradient-to-b from-background via-muted/5 to-background">
            <TestimonialsSection />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent rounded-full" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-accent/15 to-transparent rounded-full" />
          </div>
          
          {/* Stats Section with special treatment */}
          <div className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <StatsSection />
            {/* Final section decorative element */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <div className="w-3 h-3 bg-primary/40 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1 h-1 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Footer with enhanced spacing and subtle transition */}
        <div className="relative">
          {/* Gradient transition to footer */}
          <div className="h-24 bg-gradient-to-b from-background to-muted/20"></div>
          <div className="bg-gradient-to-b from-muted/20 to-muted/40 pb-8">
            <Footer />
          </div>
        </div>
        
        {/* Floating Theme Toggle with enhanced positioning */}
        <SimpleFloatingToggle position="bottom-right" />
      </main>
    </ThemeTransition>
  )
}