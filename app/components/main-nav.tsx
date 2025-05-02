import Link from "next/link"
import { Film } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { MobileNav } from "@/app/components/mobile-nav"

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6 text-red-600" />
          <span className="font-bold text-xl">MovieFinance</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-red-600">
            Browse Projects
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-red-600">
            How It Works
          </Link>
          <Link href="/community" className="text-sm font-medium transition-colors hover:text-red-600">
            Community
          </Link>
          <Link href="/resources" className="text-sm font-medium transition-colors hover:text-red-600">
            Filmmaker Resources
          </Link>
        </nav>
        <div className="flex items-center space-x-2 ml-auto">
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" className="text-sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-red-600 hover:bg-red-700 text-sm">Sign Up</Button>
          </Link>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
