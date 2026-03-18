export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Bottan Moda Akademisi
          </h3>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed text-gray-500">
            {/* Buraya uzun açıklama yazısı gelecek */}
          </p>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800/50 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Bottan Akademisi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
