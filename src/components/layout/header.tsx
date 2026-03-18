"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Bottan Akademi
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/paketler" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Paketler
            </Link>
            <Link href="/kitap" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Kitap
            </Link>
            {user ? (
              <>
                <Link href="/panel" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Panel
                </Link>
                <Link href="/paketlerim" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Paketlerim
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <Link href="/profilim" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <User className="h-4 w-4" />
                    {user.fullName}
                  </Link>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/giris">
                  <Button variant="ghost" size="sm">Giriş Yap</Button>
                </Link>
                <Link href="/kayit">
                  <Button size="sm">Kayıt Ol</Button>
                </Link>
              </div>
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link href="/paketler" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              Paketler
            </Link>
            <Link href="/kitap" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              Kitap
            </Link>
            {user ? (
              <>
                <Link href="/panel" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                  Panel
                </Link>
                <Link href="/paketlerim" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                  Paketlerim
                </Link>
                <Link href="/profilim" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                  Profilim
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-red-600">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link href="/giris" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                  Giriş Yap
                </Link>
                <Link href="/kayit" className="block py-2 text-sm text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
