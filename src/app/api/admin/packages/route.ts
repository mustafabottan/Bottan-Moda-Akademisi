import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

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

  const packages = await prisma.package.findMany({
    include: {
      packageVideos: {
        include: { video: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { orders: true, userPackages: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { title, description, price, discountPrice, isPublished, isFeatured, videoIds, thumbnailUrl } = body;

    if (!title || price === undefined) {
      return NextResponse.json({ error: "Başlık ve fiyat zorunludur" }, { status: 400 });
    }

    const slug = slugify(title);

    const existingSlug = await prisma.package.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ error: "Bu isimde bir paket zaten var" }, { status: 400 });
    }

    const pkg = await prisma.package.create({
      data: {
        title,
        description: description || null,
        slug,
        price,
        discountPrice: discountPrice || null,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        packageVideos: videoIds?.length
          ? {
              create: videoIds.map((videoId: string, index: number) => ({
                videoId,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        packageVideos: { include: { video: true } },
      },
    });

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Package create error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
