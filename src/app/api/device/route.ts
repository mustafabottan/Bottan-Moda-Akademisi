import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Register/heartbeat device session
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fingerprint, deviceName } = await request.json();

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

    // Deactivate all other sessions for this user
    await prisma.deviceSession.updateMany({
      where: {
        userId: dbUser.id,
        deviceFingerprint: { not: fingerprint },
        isActive: true,
      },
      data: { isActive: false },
    });

    // Upsert current device session
    const session = await prisma.deviceSession.upsert({
      where: {
        id: (
          await prisma.deviceSession.findFirst({
            where: {
              userId: dbUser.id,
              deviceFingerprint: fingerprint,
            },
            select: { id: true },
          })
        )?.id ?? "",
      },
      update: {
        isActive: true,
        lastActiveAt: new Date(),
        ipAddress: ip,
        deviceName: deviceName || undefined,
      },
      create: {
        userId: dbUser.id,
        deviceFingerprint: fingerprint,
        deviceName: deviceName || null,
        ipAddress: ip,
        isActive: true,
      },
    });

    return NextResponse.json({ sessionId: session.id, isActive: true });
  } catch (error) {
    console.error("Device session error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// Check if current session is still active
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID gerekli" }, { status: 400 });
    }

    const session = await prisma.deviceSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ isActive: false });
    }

    return NextResponse.json({ isActive: session.isActive });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
