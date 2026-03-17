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

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const pkg = await prisma.package.findUnique({
    where: { id: params.id },
    include: {
      packageVideos: {
        include: { video: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!pkg) {
    return NextResponse.json({ error: "Paket bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(pkg);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { title, description, price, discountPrice, isPublished, isFeatured, videoIds, thumbnailUrl } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = slugify(title);
    }
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    // Update package
    const pkg = await prisma.package.update({
      where: { id: params.id },
      data: updateData,
    });

    // Update video assignments if provided
    if (videoIds !== undefined) {
      await prisma.packageVideo.deleteMany({
        where: { packageId: params.id },
      });

      if (videoIds.length > 0) {
        await prisma.packageVideo.createMany({
          data: videoIds.map((videoId: string, index: number) => ({
            packageId: params.id,
            videoId,
            sortOrder: index,
          })),
        });
      }
    }

    const result = await prisma.package.findUnique({
      where: { id: pkg.id },
      include: {
        packageVideos: {
          include: { video: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Package update error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.package.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
