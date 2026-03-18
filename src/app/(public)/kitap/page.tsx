import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Truck, Shield } from "lucide-react";


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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Kitap Görseli */}
        <div className="flex justify-center">
          <div className="relative">
            {book.thumbnailUrl ? (
              <img
                src={book.thumbnailUrl}
                alt={book.title}
                className="rounded-xl shadow-2xl max-h-[600px] object-contain"
              />
            ) : (
              <div className="w-80 h-[480px] bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-amber-400" />
              </div>
            )}
          </div>
        </div>

        {/* Kitap Detayları */}
        <div>
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Kitap
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-2">
            {book.title}
          </h1>
          <p className="text-lg text-gray-500 mb-6">Semiye Bottan</p>

          {book.description && (
            <p className="text-gray-600 leading-relaxed mb-8">
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

          <Card className="mb-8">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span>Türkiye genelinde kargo ile teslim</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span>Orijinal basım, kaliteli baskı</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <BookOpen className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span>Pratik drapaj teknikleri ve kalıp çizimleri</span>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6">
            <BookOpen className="mr-2 h-5 w-5" />
            Satın Al
          </Button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Ödeme sistemi yakında aktif olacaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
