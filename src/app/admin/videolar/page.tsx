"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, Video } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  bunnyVideoId: string;
  duration: number;
  createdAt: string;
  _count: { packageVideos: number };
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchVideos = () => {
    fetch("/api/admin/videos")
      .then((res) => res.json())
      .then(setVideos);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title);
      formData.append("description", description);

      const res = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        setFile(null);
        fetchVideos();
      } else {
        const data = await res.json();
        alert(data.error || "Yükleme başarısız");
      }
    } catch {
      alert("Bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;

    const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchVideos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Videolar</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Video Yükle
        </Button>
      </div>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz video yüklenmemiş.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500">
              <span className="col-span-2">Başlık</span>
              <span>Süre</span>
              <span>Paketler</span>
              <span>İşlemler</span>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100">
            {videos.map((video) => (
              <div key={video.id} className="grid grid-cols-5 gap-4 py-4 items-center">
                <div className="col-span-2">
                  <p className="font-medium text-gray-900">{video.title}</p>
                  {video.description && (
                    <p className="text-sm text-gray-500 truncate">{video.description}</p>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {video.duration > 0 ? formatDuration(video.duration) : "-"}
                </span>
                <Badge variant={video._count.packageVideos > 0 ? "info" : "default"}>
                  {video._count.packageVideos} paket
                </Badge>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="text-red-500 hover:text-red-700 p-1 w-fit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Video Yükle">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            id="title"
            label="Video Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            id="description"
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Dosyası
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              İptal
            </Button>
            <Button type="submit" isLoading={uploading}>
              <Upload className="mr-2 h-4 w-4" /> Yükle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
