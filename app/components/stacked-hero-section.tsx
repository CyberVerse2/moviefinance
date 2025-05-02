import { StackedButton } from "@/app/components/ui/stacked-button"
import Link from "next/link"

export function StackedHeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12 md:py-16 lg:py-20">
      <div className="absolute inset-0 bg-stacked-pattern opacity-50"></div>
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="block text-red-600">Fund the Future of Film</span>
            <span className="block">Invest in Movie Projects</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            MovieFinance connects filmmakers with investors through blockchain-powered project tokens. Fund your
            favorite projects and share in their success.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <StackedButton asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 text-base">
              <Link href="/projects">Browse Projects</Link>
            </StackedButton>
            <StackedButton asChild variant="outline" className="px-8 py-2.5 text-base">
              <Link href="/create-project">Submit Your Film</Link>
            </StackedButton>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-16 -left-16 opacity-10">
        <div className="h-64 w-64 rounded-full bg-red-600 blur-3xl"></div>
      </div>
      <div className="absolute -top-16 -right-16 opacity-10">
        <div className="h-64 w-64 rounded-full bg-red-600 blur-3xl"></div>
      </div>
    </div>
  )
}
