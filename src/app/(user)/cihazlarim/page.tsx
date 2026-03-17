import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";

export default async function DevicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });
  if (!dbUser) redirect("/giris");

  const sessions = await prisma.deviceSession.findMany({
    where: { userId: dbUser.id },
    orderBy: { lastActiveAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Cihazlarım</h1>
      <p className="text-gray-500 text-sm mb-6">
        Aynı anda yalnızca bir cihazda video izleyebilirsiniz. Yeni bir cihazda giriş yaptığınızda diğer cihazlardaki oturumunuz otomatik olarak sonlanır.
      </p>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Henüz kayıtlı cihaz bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${session.isActive ? "bg-green-100" : "bg-gray-100"}`}>
                  <Smartphone className={`h-5 w-5 ${session.isActive ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {session.deviceName || "Bilinmeyen Cihaz"}
                    </span>
                    {session.isActive && <Badge variant="success">Aktif</Badge>}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>IP: {session.ipAddress || "-"}</span>
                    <span className="mx-2">·</span>
                    <span>Son aktif: {new Date(session.lastActiveAt).toLocaleString("tr-TR")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
