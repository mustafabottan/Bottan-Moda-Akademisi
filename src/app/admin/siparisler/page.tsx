"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "error" | "info" }> = {
  PENDING: { label: "Bekliyor", variant: "warning" },
  PAID: { label: "Ödendi", variant: "success" },
  FAILED: { label: "Başarısız", variant: "error" },
  REFUNDED: { label: "İade", variant: "info" },
};

interface OrderItem {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user: { fullName: string; email: string };
  package: { title: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Siparişler</h1>
      <Card>
        <CardHeader>
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500">
            <span>Kullanıcı</span>
            <span>Paket</span>
            <span>Tutar</span>
            <span>Durum</span>
            <span>Tarih</span>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.PENDING;
            return (
              <div key={order.id} className="grid grid-cols-5 gap-4 py-4 items-center">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{order.user.fullName}</p>
                  <p className="text-xs text-gray-500">{order.user.email}</p>
                </div>
                <span className="text-sm text-gray-900">{order.package.title}</span>
                <span className="text-sm text-gray-600">{formatPrice(order.amount)}</span>
                <Badge variant={status.variant}>{status.label}</Badge>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
