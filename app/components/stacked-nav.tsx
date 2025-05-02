import Link from "next/link"
import { Film } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { MobileNav } from "@/app/components/mobile-nav"
import { StackedButton } from "@/app/components/ui/stacked-button"

export function StackedNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-stacked">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-red-600 p-1.5 rounded-md shadow-stacked-sm">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">MovieFinance</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-red-600 relative group">
            Browse Projects
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium transition-colors hover:text-red-600 relative group"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/community" className="text-sm font-medium transition-colors hover:text-red-600 relative group">
            Community
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/resources" className="text-sm font-medium transition-colors hover:text-red-600 relative group">
            Filmmaker Resources
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
        </nav>
        <div className="flex items-center space-x-2 ml-auto">
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" className="text-sm shadow-stacked-sm hover:shadow-none">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <StackedButton className="bg-red-600 hover:bg-red-700 text-sm text-white">Sign Up</StackedButton>
          </Link>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
