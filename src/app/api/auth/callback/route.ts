import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/panel";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure user exists in our DB
      const existing = await prisma.user.findUnique({
        where: { email: data.user.email! },
      });

      if (!existing) {
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            fullName: data.user.user_metadata?.full_name || data.user.email!.split("@")[0],
          },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/giris?error=auth_failed`);
}
