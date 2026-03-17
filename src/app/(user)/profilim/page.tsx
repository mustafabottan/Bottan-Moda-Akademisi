"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setForm({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          district: data.district || "",
          postalCode: data.postalCode || "",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setUser({ ...user!, fullName: data.fullName });
        setMessage("Profil güncellendi");
      } else {
        setMessage("Güncelleme başarısız");
      }
    } catch {
      setMessage("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profilim</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <h2 className="font-semibold">Kişisel Bilgiler</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div className="bg-blue-50 text-blue-600 text-sm p-3 rounded-lg">{message}</div>
            )}
            <Input
              id="fullName"
              label="Ad Soyad"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
            <Input
              id="phone"
              label="Telefon"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="05XX XXX XX XX"
            />
            <Input
              id="address"
              label="Adres"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="city"
                label="İl"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Input
                id="district"
                label="İlçe"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>
            <Input
              id="postalCode"
              label="Posta Kodu"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
            <Button type="submit" isLoading={isLoading}>
              Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
