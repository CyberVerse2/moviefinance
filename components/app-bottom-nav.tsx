import React from 'react';
import Link from 'next/link';
import { Home, User, BarChart } from 'lucide-react'; // Example icons

export function AppBottomNav() {
  // Basic placeholder structure for bottom navigation
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    // { href: '/discover', label: 'Discover', icon: Search }, // Remove Discover link
    { href: '/markets', label: 'Markets', icon: BarChart }, // Assuming a markets page
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border/40 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted focus:outline-none group"
          >
            <item.icon className="w-5 h-5 mb-1 text-muted-foreground group-hover:text-foreground" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
