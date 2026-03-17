import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    where: { isPublished: true },
    include: {
      packageVideos: {
        include: { video: { select: { duration: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tüm Paketler</h1>

      {packages.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Henüz paket bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const videoCount = pkg.packageVideos.length;
            const totalDuration = pkg.packageVideos.reduce(
              (sum, pv) => sum + pv.video.duration,
              0
            );

            return (
              <Link key={pkg.id} href={`/paketler/${pkg.slug}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  {pkg.thumbnailUrl ? (
                    <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden">
                      <img src={pkg.thumbnailUrl} alt={pkg.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl flex items-center justify-center">
                      <Play className="h-12 w-12 text-blue-400" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2">{pkg.title}</h3>
                    {pkg.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pkg.description}</p>
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
    </div>
  );
}
