import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) {
      console.error("Signup error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      // Prisma'da kullanıcı zaten varsa atla
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: { email: data.user.email!, fullName },
        create: {
          id: data.user.id,
          email: data.user.email!,
          fullName,
        },
      });
    }

    return NextResponse.json({ message: "Kayıt başarılı" });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Bir hata oluştu" }, { status: 500 });
  }
}
