import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Truck, Shield, Star } from "lucide-react";

export const dynamic = "force-dynamic";

async function getBook() {
  return prisma.book.findFirst({
    where: { isPublished: true },
  });
}

export default async function BookPage() {
  const book = await getBook();

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-gray-500">Henüz kitap eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Book Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Kitap Görseli */}
            <div className="flex justify-center animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-orange-200 rounded-2xl blur-2xl opacity-40" />
                {book.thumbnailUrl ? (
                  <img
                    src={book.thumbnailUrl}
                    alt={book.title}
                    className="relative rounded-xl shadow-2xl max-h-[550px] object-contain"
                  />
                ) : (
                  <div className="relative w-80 h-[480px] bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-24 w-24 text-amber-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Kitap Detayları */}
            <div className="animate-fade-in animate-delay-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Kitap
                </span>
                <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Stokta
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                {book.title}
              </h1>
              <p className="text-lg text-gray-500 mb-6 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                Semiye Bottan
              </p>

              {book.description && (
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  {book.description}
                </p>
              )}

              <div className="mb-8">
                {book.discountPrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-amber-600">
                      {formatPrice(book.discountPrice.toNumber())}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(book.price.toNumber())}
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-amber-600">
                    {formatPrice(book.price.toNumber())}
                  </span>
                )}
              </div>

              <Card className="mb-8 border-amber-200/50 bg-white/80">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-amber-600" />
                    </div>
                    <span>Türkiye genelinde kargo ile teslim</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-amber-600" />
                    </div>
                    <span>Orijinal basım, kaliteli baskı</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-amber-600" />
                    </div>
                    <span>Pratik drapaj teknikleri ve kalıp çizimleri</span>
                  </div>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg py-6 shadow-lg shadow-amber-200">
                <BookOpen className="mr-2 h-5 w-5" />
                Satın Al
              </Button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Ödeme sistemi yakında aktif olacaktır.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
