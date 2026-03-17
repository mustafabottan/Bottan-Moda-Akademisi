import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, Play } from "lucide-react";

export default async function UserDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      _count: {
        select: { userPackages: true, orders: true },
      },
      userPackages: {
        include: {
          package: {
            include: {
              packageVideos: {
                include: { video: { select: { duration: true } } },
              },
            },
          },
        },
        take: 3,
        orderBy: { purchasedAt: "desc" },
      },
    },
  });

  if (!dbUser) redirect("/giris");

  const totalVideos = dbUser.userPackages.reduce(
    (sum, up) => sum + up.package.packageVideos.length,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Hoş geldiniz, {dbUser.fullName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dbUser._count.userPackages}</p>
              <p className="text-sm text-gray-500">Paketlerim</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalVideos}</p>
              <p className="text-sm text-gray-500">Toplam Video</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dbUser._count.orders}</p>
              <p className="text-sm text-gray-500">Siparişlerim</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {dbUser.userPackages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Satın Alınan Paketler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dbUser.userPackages.map((up) => (
              <Card key={up.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{up.package.title}</h3>
                  <p className="text-sm text-gray-500">
                    {up.package.packageVideos.length} video
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
