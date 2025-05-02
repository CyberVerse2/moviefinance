import { ArrowRight, Film } from "lucide-react"
import { Button } from "@/app/components/ui/button"

export function MobileHeroSection() {
  return (
    <div className="relative bg-black text-white">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200&text=Film%20Production')" }}
      />

      <div className="relative container px-4 py-8 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-white/30 px-2 py-1 text-xs mb-4 md:text-sm md:px-3 md:py-1 md:mb-6">
            <Film className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
            <span>Revolutionizing Film Financing</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tighter mb-3 md:text-5xl md:mb-6">
            Discover and Fund the Next Generation of Cinema
          </h1>

          <p className="text-sm text-white/80 mb-4 md:text-xl md:mb-8">
            Invest in films, earn potential returns, and be part of the creative journey.
          </p>

          <div className="flex gap-2 md:gap-4">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 md:size-lg">
              Explore <ArrowRight className="ml-1 h-3 w-3 md:ml-2 md:h-4 md:w-4" />
            </Button>
            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10 md:size-lg">
              For Filmmakers
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-center md:mt-12 md:grid-cols-4 md:gap-6">
            <div>
              <div className="text-xl font-bold md:text-3xl">120+</div>
              <div className="text-xs text-white/60 md:text-sm">Active Projects</div>
            </div>
            <div>
              <div className="text-xl font-bold md:text-3xl">$8.2M</div>
              <div className="text-xs text-white/60 md:text-sm">Total Funded</div>
            </div>
            <div>
              <div className="text-xl font-bold md:text-3xl">15K+</div>
              <div className="text-xs text-white/60 md:text-sm">Investors</div>
            </div>
            <div>
              <div className="text-xl font-bold md:text-3xl">85%</div>
              <div className="text-xs text-white/60 md:text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
