"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { ShoppingCart } from "lucide-react";

export function PackageBuyButton({ packageId }: { packageId: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!user) {
      router.push("/giris");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Bir hata oluştu");
        return;
      }

      setCheckoutHtml(data.checkoutFormContent);
    } catch {
      alert("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkoutHtml) {
    return (
      <div
        className="iyzico-checkout"
        dangerouslySetInnerHTML={{ __html: checkoutHtml }}
      />
    );
  }

  return (
    <Button onClick={handleBuy} isLoading={isLoading} className="w-full" size="lg">
      <ShoppingCart className="mr-2 h-5 w-5" />
      Satın Al
    </Button>
  );
}
