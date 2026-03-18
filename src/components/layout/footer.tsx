export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h3 className="text-white text-2xl font-bold mb-4">Bottan Moda Akademisi</h3>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed">
            {/* Buraya uzun açıklama yazısı gelecek */}
          </p>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Bottan Akademisi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
