"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserItem {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: { orders: number; userPackages: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kullanıcılar</h1>
      <Card>
        <CardHeader>
          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500">
            <span className="col-span-2">Kullanıcı</span>
            <span>Rol</span>
            <span>Paketler</span>
            <span>Siparişler</span>
            <span>Kayıt Tarihi</span>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-6 gap-4 py-4 items-center">
              <div className="col-span-2">
                <p className="font-medium text-gray-900">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Badge variant={user.role === "ADMIN" ? "info" : "default"}>
                {user.role}
              </Badge>
              <span className="text-sm text-gray-600">{user._count.userPackages}</span>
              <span className="text-sm text-gray-600">{user._count.orders}</span>
              <span className="text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
