import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { uploadToBunny } from "@/lib/bunny";

export async function POST(request: Request) {
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

    const formData = await request.formData();
    const file = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!file || !title) {
      return NextResponse.json({ error: "Video ve başlık zorunludur" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bunnyVideoId = await uploadToBunny(arrayBuffer, file.name);

    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        bunnyVideoId,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
  }
}
