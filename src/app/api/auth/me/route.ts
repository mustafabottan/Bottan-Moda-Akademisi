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
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        phone: true,
        address: true,
        city: true,
        district: true,
        postalCode: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, address, city, district, postalCode } = body;

    const dbUser = await prisma.user.update({
      where: { email: user.email! },
      data: {
        fullName: fullName || undefined,
        phone: phone || null,
        address: address || null,
        city: city || null,
        district: district || null,
        postalCode: postalCode || null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        phone: true,
        address: true,
        city: true,
        district: true,
        postalCode: true,
      },
    });

    return NextResponse.json(dbUser);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
