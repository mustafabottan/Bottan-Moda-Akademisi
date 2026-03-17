import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "error" | "info" }> = {
  PENDING: { label: "Bekliyor", variant: "warning" },
  PAID: { label: "Ödendi", variant: "success" },
  FAILED: { label: "Başarısız", variant: "error" },
  REFUNDED: { label: "İade Edildi", variant: "info" },
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });
  if (!dbUser) redirect("/giris");

  const orders = await prisma.order.findMany({
    where: { userId: dbUser.id },
    include: {
      package: { select: { title: true, slug: true, thumbnailUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Siparişlerim</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Henüz siparişiniz bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
              <span>Paket</span>
              <span>Tutar</span>
              <span>Durum</span>
              <span>Tarih</span>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100">
            {orders.map((order) => {
              const status = statusMap[order.status] || statusMap.PENDING;
              return (
                <div key={order.id} className="grid grid-cols-4 gap-4 py-4 items-center">
                  <span className="font-medium text-gray-900">{order.package.title}</span>
                  <span className="text-gray-600">{formatPrice(order.amount.toNumber())}</span>
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
