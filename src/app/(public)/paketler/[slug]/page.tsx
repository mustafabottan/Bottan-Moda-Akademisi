import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, ShoppingCart } from "lucide-react";
import { PackageBuyButton } from "./buy-button";

export const dynamic = "force-dynamic";

export default async function PackageDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const pkg = await prisma.package.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: {
      packageVideos: {
        include: { video: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!pkg) notFound();

  const totalDuration = pkg.packageVideos.reduce(
    (sum, pv) => sum + pv.video.duration,
    0
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {pkg.thumbnailUrl ? (
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
              <img src={pkg.thumbnailUrl} alt={pkg.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6">
              <Play className="h-16 w-16 text-blue-400" />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pkg.title}</h1>
          {pkg.description && (
            <p className="text-gray-600 mb-8 leading-relaxed">{pkg.description}</p>
          )}

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Paket İçeriği ({pkg.packageVideos.length} Video)
          </h2>
          <div className="space-y-3">
            {pkg.packageVideos.map((pv, index) => (
              <Card key={pv.videoId}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{pv.video.title}</h3>
                    {pv.video.description && (
                      <p className="text-sm text-gray-500 truncate">{pv.video.description}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(pv.video.duration)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar - Purchase */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="mb-4">
                {pkg.discountPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(pkg.discountPrice.toNumber())}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(pkg.price.toNumber())}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(pkg.price.toNumber())}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-blue-500" />
                  <span>{pkg.packageVideos.length} video</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Toplam {formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                  <span>Ömür boyu erişim</span>
                </div>
              </div>

              <PackageBuyButton packageId={pkg.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
