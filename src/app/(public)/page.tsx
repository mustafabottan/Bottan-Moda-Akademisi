import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Play, Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

async function getFeaturedPackages() {
  return prisma.package.findMany({
    where: { isPublished: true, isFeatured: true },
    include: {
      packageVideos: {
        include: { video: { select: { duration: true } } },
      },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

async function getBook() {
  return prisma.book.findFirst({
    where: { isPublished: true },
  });
}

async function getActiveCampaigns() {
  const now = new Date();
  return prisma.campaign.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    take: 3,
  });
}

export default async function HomePage() {
  const [featuredPackages, campaigns, book] = await Promise.all([
    getFeaturedPackages(),
    getActiveCampaigns(),
    getBook(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bottan Moda Akademisi
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Moda dünyasında uzmanlaşmak için video eğitim paketlerimizi keşfedin
          </p>
          <Link href="/paketler">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Paketleri İncele
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Kitap + Paket Kampanya Bülteni */}
      {book && featuredPackages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 mb-8">
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-center">
              <div className="p-4 flex justify-center">
                {book.thumbnailUrl && (
                  <img
                    src={book.thumbnailUrl}
                    alt={book.title}
                    className="h-48 object-contain rounded-lg shadow-lg"
                  />
                )}
              </div>
              <div className="p-6 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-200" />
                  <span className="text-yellow-100 text-sm font-semibold uppercase tracking-wide">Ozel Kampanya</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Kitap + Video Paketi Birlikte Alin!
                </h3>
                <p className="text-amber-100 mb-4">
                  &quot;{book.title}&quot; kitabi ve video egitim paketini birlikte alarak moda tasariminda kendinizi gelistirin.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/kitap">
                    <Button className="bg-white text-amber-700 hover:bg-amber-50">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Kitabi Incele
                    </Button>
                  </Link>
                  <Link href="/paketler">
                    <Button className="bg-amber-800 text-white hover:bg-amber-900 border border-amber-400">
                      <Play className="mr-2 h-4 w-4" />
                      Paketleri Incele
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Campaign Banners */}
      {campaigns.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-1">{campaign.title}</h3>
                  <p className="text-sm text-orange-100 mb-2">{campaign.description}</p>
                  <span className="text-2xl font-bold">%{campaign.discountPercentage} İndirim</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Öne Çıkan Paketler</h2>
          <Link href="/paketler" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            Tümünü Gör <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredPackages.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Henüz paket eklenmemiş.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPackages.map((pkg) => {
              const videoCount = pkg.packageVideos.length;
              const totalDuration = pkg.packageVideos.reduce(
                (sum, pv) => sum + pv.video.duration,
                0
              );

              return (
                <Link key={pkg.id} href={`/paketler/${pkg.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    {pkg.thumbnailUrl && (
                      <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden">
                        <img
                          src={pkg.thumbnailUrl}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2">{pkg.title}</h3>
                      {pkg.description && (
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {pkg.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Play className="h-4 w-4" /> {videoCount} video
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {formatDuration(totalDuration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {pkg.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(pkg.discountPrice.toNumber())}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(pkg.price.toNumber())}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(pkg.price.toNumber())}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Package className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">{featuredPackages.length}+</h3>
              <p className="text-gray-500">Eğitim Paketi</p>
            </div>
            <div>
              <Play className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">100+</h3>
              <p className="text-gray-500">Video İçerik</p>
            </div>
            <div>
              <Clock className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-500">Saat Eğitim</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
