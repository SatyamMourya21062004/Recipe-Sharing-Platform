'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <span className="text-2xl">🍳</span>
            RecipeShare
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/recipes" className="text-foreground hover:text-primary transition-colors">
              Recipes
            </Link>

            {user ? (
              <>
                <Link
                  href="/recipes/create"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Share Recipe
                </Link>
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${user.id}`} className="text-foreground hover:text-primary transition-colors">
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-foreground hover:text-primary transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
