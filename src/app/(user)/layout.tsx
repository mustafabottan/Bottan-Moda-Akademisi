import { Header } from "@/components/layout/header";
import { UserSidebar } from "@/components/layout/user-sidebar";
import { DeviceGuard } from "@/components/layout/device-guard";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DeviceGuard>
        <div className="flex">
          <UserSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </DeviceGuard>
    </div>
  );
}
