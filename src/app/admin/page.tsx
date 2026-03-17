"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, Video, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  totalPackages: number;
  totalVideos: number;
  totalOrders: number;
  paidOrders: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>;
  }

  const cards = [
    { label: "Toplam Kullanıcı", value: stats.totalUsers, icon: Users, color: "blue" },
    { label: "Toplam Paket", value: stats.totalPackages, icon: Package, color: "green" },
    { label: "Toplam Video", value: stats.totalVideos, icon: Video, color: "purple" },
    { label: "Toplam Sipariş", value: stats.totalOrders, icon: ShoppingCart, color: "orange" },
    { label: "Başarılı Ödeme", value: stats.paidOrders, icon: TrendingUp, color: "emerald" },
    { label: "Toplam Gelir", value: formatPrice(stats.revenue), icon: DollarSign, color: "rose" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${colorMap[card.color]}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
