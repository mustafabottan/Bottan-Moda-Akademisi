import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createCheckoutForm } from "@/lib/iyzico";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId } = await request.json();

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already purchased
    const existingPurchase = await prisma.userPackage.findUnique({
      where: {
        userId_packageId: { userId: dbUser.id, packageId },
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: "Bu paketi zaten satın aldınız" }, { status: 400 });
    }

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg || !pkg.isPublished) {
      return NextResponse.json({ error: "Paket bulunamadı" }, { status: 404 });
    }

    const finalPrice = pkg.discountPrice ?? pkg.price;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: dbUser.id,
        packageId: pkg.id,
        amount: finalPrice,
      },
    });

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const nameParts = dbUser.fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const result = await createCheckoutForm({
      price: finalPrice.toString(),
      paidPrice: finalPrice.toString(),
      basketId: order.id,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
      buyer: {
        id: dbUser.id,
        name: firstName,
        surname: lastName,
        email: dbUser.email,
        ip: ip.split(",")[0].trim(),
        city: dbUser.city || "Istanbul",
        country: "Turkey",
        address: dbUser.address || "Istanbul",
      },
      packageTitle: pkg.title,
    });

    if (result.status === "success") {
      return NextResponse.json({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });

    return NextResponse.json({ error: result.errorMessage || "Ödeme başlatılamadı" }, { status: 400 });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
