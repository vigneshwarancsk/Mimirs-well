'use client';

import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

interface ProfileAvatarProps {
  currentStreak?: number;
  totalBooksCompleted?: number;
}

// Bear face variants based on reading activity
const getBearFace = (variant: number) => {
  const faces = [
    // Happy/Excited (high activity)
    '🐻',
    '🐻‍❄️',
    // Content/Reading
    '🧸',
    '🐼',
    // Determined/Focused
    '😊',
    '😄',
    // Motivated
    '🌟',
    '✨',
  ];
  return faces[variant % faces.length];
};

export function ProfileAvatar({ currentStreak = 0, totalBooksCompleted = 0 }: ProfileAvatarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [bearVariant, setBearVariant] = useState(0);

  // Change bear face based on activity
  useEffect(() => {
    // Variant changes based on streak and books completed
    const variant = Math.min(
      Math.floor((currentStreak + totalBooksCompleted) / 3),
      7
    );
    setBearVariant(variant);
  }, [currentStreak, totalBooksCompleted]);

  // Animate bear face occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setBearVariant((prev) => (prev + 1) % 8);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 hover:from-amber-300 hover:to-orange-400 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg border-2 border-white/50"
      >
        <span className="text-2xl transition-transform duration-300 hover:scale-110">
          {getBearFace(bearVariant)}
        </span>
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-xl border border-sand overflow-hidden z-50 animate-slide-up">
          {/* User Info */}
          <div className="px-4 py-3 bg-gradient-to-r from-cream to-sand border-b border-sand">
            <p className="text-sm font-medium text-ink truncate">
              {user?.name || 'Reader'}
            </p>
            <p className="text-xs text-walnut/70 truncate">
              {user?.email}
            </p>
          </div>

          {/* Stats Preview */}
          {(currentStreak > 0 || totalBooksCompleted > 0) && (
            <div className="px-4 py-2 bg-cream/50 border-b border-sand">
              <div className="flex items-center justify-between text-xs">
                <span className="text-walnut/70">Streak</span>
                <span className="font-semibold text-copper">{currentStreak} 🔥</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-walnut/70">Completed</span>
                <span className="font-semibold text-copper">{totalBooksCompleted} 📚</span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-walnut hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
