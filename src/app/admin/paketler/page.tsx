"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PackageItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  packageVideos: { video: { title: string } }[];
  _count: { orders: number; userPackages: number };
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/packages")
      .then((res) => res.json())
      .then(setPackages);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu paketi silmek istediğinize emin misiniz?")) return;

    const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    if (res.ok) setPackages(packages.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paketler</h1>
        <Link href="/admin/paketler/yeni">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yeni Paket
          </Button>
        </Link>
      </div>

      {packages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz paket oluşturulmamış.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500">
              <span className="col-span-2">Başlık</span>
              <span>Fiyat</span>
              <span>Durum</span>
              <span>Satış</span>
              <span>İşlemler</span>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100">
            {packages.map((pkg) => (
              <div key={pkg.id} className="grid grid-cols-6 gap-4 py-4 items-center">
                <div className="col-span-2">
                  <p className="font-medium text-gray-900">{pkg.title}</p>
                  <p className="text-sm text-gray-500">{pkg.packageVideos.length} video</p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatPrice(pkg.discountPrice ?? pkg.price)}
                </span>
                <div className="flex gap-1">
                  <Badge variant={pkg.isPublished ? "success" : "default"}>
                    {pkg.isPublished ? "Yayında" : "Taslak"}
                  </Badge>
                  {pkg.isFeatured && <Badge variant="info">Öne Çıkan</Badge>}
                </div>
                <span className="text-sm text-gray-600">{pkg._count.userPackages}</span>
                <div className="flex gap-2">
                  <Link href={`/admin/paketler/${pkg.id}`}>
                    <button className="text-blue-500 hover:text-blue-700 p-1">
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
