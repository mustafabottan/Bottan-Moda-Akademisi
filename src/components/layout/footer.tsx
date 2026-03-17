import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">VideoPaket</h3>
            <p className="text-sm">
              En kaliteli video eğitim paketleri ile kendinizi geliştirin.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/paketler" className="hover:text-white transition-colors">Paketler</Link></li>
              <li><Link href="/giris" className="hover:text-white transition-colors">Giriş Yap</Link></li>
              <li><Link href="/kayit" className="hover:text-white transition-colors">Kayıt Ol</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm">
              <li>info@videopaket.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} VideoPaket. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
