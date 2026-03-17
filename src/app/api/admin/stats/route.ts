import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalPackages, totalVideos, totalOrders, paidOrders, revenue] =
      await Promise.all([
        prisma.user.count(),
        prisma.package.count(),
        prisma.video.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: "PAID" } }),
        prisma.order.aggregate({
          where: { status: "PAID" },
          _sum: { amount: true },
        }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalPackages,
      totalVideos,
      totalOrders,
      paidOrders,
      revenue: revenue._sum.amount?.toNumber() || 0,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
