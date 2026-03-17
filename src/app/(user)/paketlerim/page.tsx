import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default async function MyPackagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });
  if (!dbUser) redirect("/giris");

  const userPackages = await prisma.userPackage.findMany({
    where: { userId: dbUser.id },
    include: {
      package: {
        include: {
          packageVideos: {
            include: { video: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
    orderBy: { purchasedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paketlerim</h1>

      {userPackages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">Henüz satın aldığınız bir paket yok.</p>
            <Link href="/paketler">
              <Button>Paketleri İncele</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {userPackages.map((up) => {
            const totalDuration = up.package.packageVideos.reduce(
              (sum, pv) => sum + pv.video.duration,
              0
            );

            return (
              <Card key={up.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{up.package.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Play className="h-4 w-4" /> {up.package.packageVideos.length} video
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {formatDuration(totalDuration)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {up.package.packageVideos.map((pv, index) => (
                      <Link
                        key={pv.videoId}
                        href={`/paketlerim/${up.packageId}?video=${pv.videoId}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{pv.video.title}</p>
                        </div>
                        <span className="text-xs text-gray-400">{formatDuration(pv.video.duration)}</span>
                        <Play className="h-4 w-4 text-blue-500" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
