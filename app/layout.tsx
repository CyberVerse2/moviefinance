import "@/app/globals.css"
import "@/app/stacked-theme.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { AppHeader } from '@/components/app-header';
import { Providers } from "@/components/providers";
import { AppBottomNav } from "@/components/app-bottom-nav";
import ClientLayout from "@/components/client-layout";
import { Toaster } from "@/app/components/ui/sonner"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AppHeader />
            <main className="flex-1 pb-16 md:pb-0"> 
              <ClientLayout>{children}</ClientLayout>
            </main>
            <Toaster richColors closeButton />
            <AppBottomNav />
            {/* Floating Action Button */}
            <Link href="/create-project" passHref legacyBehavior>
              <Button 
                asChild 
                className="fixed bottom-28 right-6 h-14 w-14 rounded-full p-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white z-50"
                title="Create New Project"
              >
                <a><Plus className="h-6 w-6" /></a>
              </Button>
            </Link>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
