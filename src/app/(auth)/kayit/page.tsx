"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Bir hata oluştu");
        return;
      }

      router.push("/giris?registered=true");
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
          <h1 className="text-xl font-semibold text-gray-900 mt-4">Kayıt Ol</h1>
          <p className="text-sm text-gray-500 mt-1">Yeni hesap oluşturun</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}
          <Input
            id="fullName"
            label="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ad Soyad"
            required
          />
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
            placeholder="En az 6 karakter"
            minLength={6}
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Kayıt Ol
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-blue-600 hover:text-blue-700 font-medium">
            Giriş Yap
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
