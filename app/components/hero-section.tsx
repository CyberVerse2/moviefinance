import { ArrowRight, Film } from "lucide-react"
import { Button } from "@/app/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative bg-black text-white">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200&text=Film%20Production')" }}
      />

      <div className="relative container px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-sm mb-6">
            <Film className="mr-2 h-4 w-4" />
            <span>Revolutionizing Film Financing</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-6">
            Discover and Fund the Next Generation of Cinema
          </h1>

          <p className="max-w-[600px] text-white/80 md:text-xl mb-8">
            MovieFinance connects filmmakers with investors through blockchain-powered project tokens. Invest in films,
            earn potential returns, and be part of the creative journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              For Filmmakers
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">120+</div>
              <div className="text-sm text-white/60">Active Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$8.2M</div>
              <div className="text-sm text-white/60">Total Funded</div>
            </div>
            <div>
              <div className="text-3xl font-bold">15K+</div>
              <div className="text-sm text-white/60">Investors</div>
            </div>
            <div>
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm text-white/60">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
