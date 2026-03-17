"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone } from "lucide-react";

interface CampaignItem {
  id: string;
  title: string;
  description: string | null;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  campaignPackages: { package: { id: string; title: string } }[];
}

interface PackageOption {
  id: string;
  title: string;
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercentage: "",
    bannerImageUrl: "",
    startDate: "",
    endDate: "",
    isActive: true,
    packageIds: [] as string[],
  });

  const fetchData = () => {
    Promise.all([
      fetch("/api/admin/campaigns").then((r) => r.json()),
      fetch("/api/admin/packages").then((r) => r.json()),
    ]).then(([c, p]) => {
      setCampaigns(c);
      setPackages(p);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discountPercentage: parseInt(form.discountPercentage),
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setForm({
          title: "", description: "", discountPercentage: "",
          bannerImageUrl: "", startDate: "", endDate: "",
          isActive: true, packageIds: [],
        });
        fetchData();
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

  const togglePackage = (packageId: string) => {
    setForm((prev) => ({
      ...prev,
      packageIds: prev.packageIds.includes(packageId)
        ? prev.packageIds.filter((id) => id !== packageId)
        : [...prev.packageIds, packageId],
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kampanyalar</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Kampanya
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz kampanya oluşturulmamış.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => {
            const isExpired = new Date(campaign.endDate) < new Date();
            return (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                    <div className="flex gap-1">
                      {campaign.isActive && !isExpired ? (
                        <Badge variant="success">Aktif</Badge>
                      ) : (
                        <Badge variant="default">{isExpired ? "Sona Erdi" : "Pasif"}</Badge>
                      )}
                    </div>
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-gray-500 mb-3">{campaign.description}</p>
                  )}
                  <p className="text-2xl font-bold text-orange-600 mb-3">
                    %{campaign.discountPercentage} İndirim
                  </p>
                  <div className="text-sm text-gray-500 mb-3">
                    {new Date(campaign.startDate).toLocaleDateString("tr-TR")} -{" "}
                    {new Date(campaign.endDate).toLocaleDateString("tr-TR")}
                  </div>
                  {campaign.campaignPackages.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {campaign.campaignPackages.map((cp) => (
                        <Badge key={cp.package.id} variant="info">{cp.package.title}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Kampanya" className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            label="Kampanya Başlığı"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            id="description"
            label="Açıklama"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="discountPercentage"
              label="İndirim %"
              type="number"
              min="1"
              max="100"
              value={form.discountPercentage}
              onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
              required
            />
            <Input
              id="startDate"
              label="Başlangıç"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
            <Input
              id="endDate"
              label="Bitiş"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>
          <Input
            id="bannerImageUrl"
            label="Banner URL"
            value={form.bannerImageUrl}
            onChange={(e) => setForm({ ...form, bannerImageUrl: e.target.value })}
          />
          {packages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paketler</label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-3">
                {packages.map((pkg) => (
                  <label key={pkg.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.packageIds.includes(pkg.id)}
                      onChange={() => togglePackage(pkg.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{pkg.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              İptal
            </Button>
            <Button type="submit" isLoading={isLoading}>Oluştur</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
