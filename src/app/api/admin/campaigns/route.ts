import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { role: true },
  });
  return dbUser?.role === "ADMIN" ? user : null;
}

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const campaigns = await prisma.campaign.findMany({
    include: {
      campaignPackages: {
        include: { package: { select: { id: true, title: true } } },
      },
    },
    orderBy: { startDate: "desc" },
  });

  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { title, description, discountPercentage, bannerImageUrl, startDate, endDate, isActive, packageIds } = body;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description: description || null,
        discountPercentage,
        bannerImageUrl: bannerImageUrl || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive ?? true,
        campaignPackages: packageIds?.length
          ? {
              create: packageIds.map((packageId: string) => ({ packageId })),
            }
          : undefined,
      },
      include: {
        campaignPackages: {
          include: { package: { select: { id: true, title: true } } },
        },
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Campaign create error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
