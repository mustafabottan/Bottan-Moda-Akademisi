import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Play, Clock, ArrowRight, BookOpen, Sparkles, GraduationCap } from "lucide-react";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
              <GraduationCap className="h-4 w-4" />
              Moda Eğitiminde Yeni Dönem
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in animate-delay-100 tracking-tight">
            Bottan Moda
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Akademisi
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-200 mb-10 max-w-2xl mx-auto animate-fade-in animate-delay-200 leading-relaxed">
            Moda dünyasında uzmanlaşmak için video eğitim paketlerimizi keşfedin.
            Drapaj, kalıp ve tasarım tekniklerini öğrenin.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in animate-delay-300">
            <Link href="/paketler">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-blue-50 shadow-lg shadow-white/20 text-base px-8">
                Paketleri İncele
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/kitap">
              <Button size="lg" className="bg-transparent text-white border-2 border-white/30 hover:bg-white/10 text-base px-8">
                <BookOpen className="mr-2 h-5 w-5" />
                Kitabı Keşfet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Kitap + Paket Kampanya Bülteni */}
      {book && featuredPackages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-12">
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-center">
              <div className="p-6 flex justify-center">
                {book.thumbnailUrl && (
                  <img
                    src={book.thumbnailUrl}
                    alt={book.title}
                    className="h-52 object-contain rounded-xl shadow-2xl animate-float"
                  />
                )}
              </div>
              <div className="p-8 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-yellow-200" />
                  <span className="text-yellow-100 text-sm font-semibold uppercase tracking-wider">Özel Kampanya</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Kitap + Video Paketi Birlikte Alın!
                </h3>
                <p className="text-amber-100 mb-6 leading-relaxed">
                  &quot;{book.title}&quot; kitabı ve video eğitim paketini birlikte alarak moda tasarımında kendinizi geliştirin.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/kitap">
                    <Button className="bg-white text-amber-700 hover:bg-amber-50 shadow-lg">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Kitabı İncele
                    </Button>
                  </Link>
                  <Link href="/paketler">
                    <Button className="bg-amber-800/50 text-white hover:bg-amber-800 border border-amber-300/50">
                      <Play className="mr-2 h-4 w-4" />
                      Paketleri İncele
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Öne Çıkan Paketler</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Uzman eğitmenler tarafından hazırlanan video paketlerimiz ile moda dünyasına adım atın.</p>
        </div>

        {featuredPackages.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Henüz paket eklenmemiş.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => {
              const videoCount = pkg.packageVideos.length;
              const totalDuration = pkg.packageVideos.reduce(
                (sum, pv) => sum + pv.video.duration,
                0
              );

              return (
                <Link key={pkg.id} href={`/paketler/${pkg.slug}`}>
                  <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border-gray-100 group">
                    {pkg.thumbnailUrl ? (
                      <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden">
                        <img
                          src={pkg.thumbnailUrl}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-xl flex items-center justify-center">
                        <Play className="h-12 w-12 text-blue-300" />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{pkg.title}</h3>
                      {pkg.description && (
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {pkg.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Play className="h-3.5 w-3.5" /> {videoCount} video
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {formatDuration(totalDuration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        {pkg.discountPrice ? (
                          <>
                            <span className="text-xl font-bold text-blue-600">
                              {formatPrice(pkg.discountPrice.toNumber())}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(pkg.price.toNumber())}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-blue-600">
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

        <div className="text-center mt-10">
          <Link href="/paketler">
            <Button variant="outline" size="lg" className="px-8">
              Tüm Paketleri Gör
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{featuredPackages.length}+</h3>
              <p className="text-gray-500 mt-1">Eğitim Paketi</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Play className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">100+</h3>
              <p className="text-gray-500 mt-1">Video İçerik</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-500 mt-1">Saat Eğitim</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
