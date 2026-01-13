'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Search, Library, Home, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userStats, setUserStats] = useState({ currentStreak: 0, totalBooksCompleted: 0 });

  useEffect(() => {
    // Fetch user stats for profile avatar
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUserStats({
            currentStreak: data.data.currentStreak || 0,
            totalBooksCompleted: data.data.totalBooksCompleted || 0,
          });
        }
      })
      .catch(() => {
        // Silently fail - use defaults
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'My Library', icon: Library },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-parchment/80 backdrop-blur-md border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 group">
            <BookOpen className="w-8 h-8 text-copper group-hover:text-amber transition-colors" />
            <span className="font-display text-xl font-bold text-ink">
              Mimir&apos;s Well
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 py-2 transition-colors ${
                  isActive(href)
                    ? 'text-copper font-medium'
                    : 'text-walnut hover:text-copper'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <ProfileAvatar
                currentStreak={userStats.currentStreak}
                totalBooksCompleted={userStats.totalBooksCompleted}
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-walnut hover:text-copper transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-cream border-t border-sand">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                  isActive(href)
                    ? 'bg-copper/10 text-copper font-medium'
                    : 'text-walnut hover:bg-sand/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            <hr className="border-sand" />
            {user && (
              <div className="px-3 py-2">
                <div className="flex items-center gap-3">
                  <ProfileAvatar
                    currentStreak={userStats.currentStreak}
                    totalBooksCompleted={userStats.totalBooksCompleted}
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="text-xs text-walnut/70">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full py-2 px-3 rounded-md text-walnut hover:bg-sand/50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
