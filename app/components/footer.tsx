import Link from "next/link"
import { Film } from "lucide-react"

export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`border-t py-6 md:py-0 ${className}`}>
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1 rounded-md shadow-stacked-sm">
            <Film className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">© 2023 MovieFinance</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
