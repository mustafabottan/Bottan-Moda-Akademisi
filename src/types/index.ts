export interface PackageWithDetails {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  price: number;
  discountPrice: number | null;
  thumbnailUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  videoCount: number;
  totalDuration: number;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: number;
  sortOrder: number;
}

export interface OrderItem {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  package: {
    title: string;
    slug: string;
    thumbnailUrl: string | null;
  };
}

export interface DeviceSessionItem {
  id: string;
  deviceName: string | null;
  ipAddress: string | null;
  isActive: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  description: string | null;
  discountPercentage: number;
  bannerImageUrl: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  packages: { id: string; title: string }[];
}
