"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/app/components/ui/sheet"
import { StackedButton } from "@/app/components/ui/stacked-button"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden ml-2">
        <Button variant="ghost" size="icon" className="md:hidden shadow-stacked-sm hover:shadow-none">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 shadow-stacked-lg">
        <SheetHeader className="px-7 pt-5 border-b pb-5">
          <SheetTitle>
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-bold">MovieFinance</span>
            </Link>
          </SheetTitle>
          {/* <SheetDescription>Optional description</SheetDescription> */}
        </SheetHeader>
        <nav className="flex flex-col gap-4 px-7 mt-6">
          <Link
            href="/"
            className="text-base font-medium p-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Browse Projects
          </Link>
          <Link
            href="/how-it-works"
            className="text-base font-medium p-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/community"
            className="text-base font-medium p-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Community
          </Link>
          <Link
            href="/resources"
            className="text-base font-medium p-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Filmmaker Resources
          </Link>
          <Link
            href="/login"
            className="text-base font-medium p-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Log In
          </Link>
          <Link href="/signup" onClick={() => setOpen(false)}>
            <StackedButton className="w-full bg-red-600 hover:bg-red-700 text-white">Sign Up</StackedButton>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
