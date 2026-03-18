import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { retrieveCheckoutForm } from "@/lib/iyzico";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const formData = await request.formData();
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.redirect(`${appUrl}/siparislerim?error=no_token`);
    }

    const result = await retrieveCheckoutForm(token);

    if (result.paymentStatus === "SUCCESS") {
      const orderId = result.basketId;

      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          iyzicoPaymentId: result.paymentId,
        },
      });

      // Grant access
      await prisma.userPackage.upsert({
        where: {
          userId_packageId: {
            userId: order.userId,
            packageId: order.packageId,
          },
        },
        update: {},
        create: {
          userId: order.userId,
          packageId: order.packageId,
        },
      });

      return NextResponse.redirect(
        `${appUrl}/siparislerim?success=true`
      );
    }

    // Payment failed
    if (result.basketId) {
      await prisma.order.update({
        where: { id: result.basketId },
        data: { status: "FAILED" },
      });
    }

    return NextResponse.redirect(
      `${appUrl}/siparislerim?error=payment_failed`
    );
  } catch (error) {
    console.error("Payment callback error:", error);
    const fallbackUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${fallbackUrl}/siparislerim?error=unknown`
    );
  }
}
