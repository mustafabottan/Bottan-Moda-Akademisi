"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, Loader2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  bunnyVideoId: string;
}

interface VideoPlayerProps {
  videos: Video[];
  activeVideoId: string;
  packageId: string;
}

export function VideoPlayer({ videos, activeVideoId, packageId }: VideoPlayerProps) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos.find((v) => v.id === activeVideoId) || videos[0];

  useEffect(() => {
    if (!currentVideo) return;

    const fetchSignedUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/videos/signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId: currentVideo.id }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Video yüklenemedi");
          return;
        }

        const data = await res.json();
        setVideoUrl(data.url);
      } catch {
        setError("Video yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [currentVideo]);

  const selectVideo = (videoId: string) => {
    router.push(`/paketlerim/${packageId}?video=${videoId}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Player */}
      <div className="lg:col-span-2">
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>{error}</p>
            </div>
          ) : videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full"
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : null}
        </div>
        {currentVideo && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentVideo.title}</h2>
            {currentVideo.description && (
              <p className="text-gray-500 mt-2">{currentVideo.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Video List */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Video Listesi ({videos.length})
            </h3>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => selectVideo(video.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    video.id === activeVideoId
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    video.id === activeVideoId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {video.id === activeVideoId ? (
                      <Play className="h-3 w-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
