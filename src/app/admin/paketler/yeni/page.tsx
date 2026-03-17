"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface VideoOption {
  id: string;
  title: string;
  duration: number;
}

export default function NewPackagePage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    thumbnailUrl: "",
    isPublished: false,
    isFeatured: false,
    videoIds: [] as string[],
  });

  useEffect(() => {
    fetch("/api/admin/videos")
      .then((res) => res.json())
      .then(setVideos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/paketler");
      } else {
        const data = await res.json();
        alert(data.error || "Bir hata oluştu");
      }
    } catch {
      alert("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVideo = (videoId: string) => {
    setForm((prev) => ({
      ...prev,
      videoIds: prev.videoIds.includes(videoId)
        ? prev.videoIds.filter((id) => id !== videoId)
        : [...prev.videoIds, videoId],
    }));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/paketler" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Paket</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h2 className="font-semibold">Paket Bilgileri</h2></CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="title"
              label="Paket Başlığı"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Textarea
              id="description"
              label="Açıklama"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="price"
                label="Fiyat (TL)"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <Input
                id="discountPrice"
                label="İndirimli Fiyat (TL)"
                type="number"
                step="0.01"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
              />
            </div>
            <Input
              id="thumbnailUrl"
              label="Kapak Resmi URL"
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            />
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Yayınla</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Öne Çıkar</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">Videolar ({form.videoIds.length} seçili)</h2>
          </CardHeader>
          <CardContent>
            {videos.length === 0 ? (
              <p className="text-gray-500 text-sm">Önce video yüklemeniz gerekiyor.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {videos.map((video) => (
                  <label
                    key={video.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.videoIds.includes(video.id)}
                      onChange={() => toggleVideo(video.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-900">{video.title}</span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 flex justify-end gap-3">
          <Link href="/admin/paketler">
            <Button type="button" variant="outline">İptal</Button>
          </Link>
          <Button type="submit" isLoading={isLoading}>Paket Oluştur</Button>
        </div>
      </form>
    </div>
  );
}
