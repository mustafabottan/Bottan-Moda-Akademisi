import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { VideoPlayer } from "./video-player";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: { packageId: string };
  searchParams: { video?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });
  if (!dbUser) redirect("/giris");

  // Check ownership
  const userPackage = await prisma.userPackage.findUnique({
    where: {
      userId_packageId: {
        userId: dbUser.id,
        packageId: params.packageId,
      },
    },
    include: {
      package: {
        include: {
          packageVideos: {
            include: { video: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!userPackage) notFound();

  const videos = userPackage.package.packageVideos.map((pv) => pv.video);
  const activeVideoId = searchParams.video || videos[0]?.id;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {userPackage.package.title}
      </h1>
      <VideoPlayer
        videos={videos}
        activeVideoId={activeVideoId}
        packageId={params.packageId}
      />
    </div>
  );
}
