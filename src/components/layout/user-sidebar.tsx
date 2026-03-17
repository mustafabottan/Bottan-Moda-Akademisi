"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Smartphone,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/panel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paketlerim", label: "Paketlerim", icon: Package },
  { href: "/siparislerim", label: "Siparişlerim", icon: ShoppingCart },
  { href: "/cihazlarim", label: "Cihazlarım", icon: Smartphone },
  { href: "/profilim", label: "Profilim", icon: User },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Hesabım</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/panel"
              ? pathname === "/panel"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
