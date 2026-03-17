import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateSignedUrl } from "@/lib/bunny";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId } = await request.json();

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has access to a package containing this video
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        packageVideos: {
          include: {
            package: {
              include: {
                userPackages: {
                  where: { userId: dbUser.id },
                },
              },
            },
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video bulunamadı" }, { status: 404 });
    }

    // Admin can access any video
    const hasAccess =
      dbUser.role === "ADMIN" ||
      video.packageVideos.some((pv) => pv.package.userPackages.length > 0);

    if (!hasAccess) {
      return NextResponse.json({ error: "Erişim yetkiniz yok" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const signedUrl = generateSignedUrl(video.bunnyVideoId, ip);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Signed URL error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
