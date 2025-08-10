'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { UserNav } from '@/components/auth/user-nav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Trees, Map, PlusCircle, User, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-provider';

const navItems = [
  { href: '/map', label: 'Mapa', icon: Map },
  { href: '/submit', label: 'Zgłoś Drzewo', icon: PlusCircle },
  { href: '/community', label: 'Społeczność', icon: Users },
  { href: '/profile', label: 'Profil', icon: User },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/map"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">EcoSpotter</span>
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'transition-colors hover:text-foreground whitespace-nowrap',
              pathname.startsWith(item.href)
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Przełącz menu nawigacyjne</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-background">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium mt-6">
            <Link
              href="/map"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">EcoSpotter</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-2.5 transition-colors hover:text-foreground',
                  pathname.startsWith(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial" />
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Trees className="h-5 w-5" />
          <span>{user?.points ?? 0} Punktów</span>
        </div>
        <UserNav />
      </div>
    </header>
  );
}
