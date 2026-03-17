"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("E-posta veya şifre hatalı");
        return;
      }

      router.push("/panel");
      router.refresh();
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">VideoPaket</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-4">Giriş Yap</h1>
          <p className="text-sm text-gray-500 mt-1">Hesabınıza giriş yapın</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}
          <Input
            id="email"
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            required
          />
          <Input
            id="password"
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Giriş Yap
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="text-blue-600 hover:text-blue-700 font-medium">
            Kayıt Ol
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
