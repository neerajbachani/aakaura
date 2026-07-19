"use client";
import { useState, useEffect } from "react";
import AdminTabs from "@/components/ui/AdminTabs";
import { useCouponSettings, useUpdateCouponSettings } from "@/hooks/admin/useAdminBookings";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";

export default function AdminCouponSettingsPage() {
  const { data, isLoading } = useCouponSettings();
  const updateSettings = useUpdateCouponSettings();
  const [form, setForm] = useState({ discountType: "PERCENT", discountValue: "25" });

  useEffect(() => {
    if (data) {
      setForm({
        discountType: data.discountType,
        discountValue: String(data.discountValue),
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto">
        <AdminTabs activeTab="coupon-settings" />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Coupon Settings</h1>
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Default discount used to pre-fill the coupon form when you manually issue a Ritual Package I
            coupon from a booking. You can still override the code, type, and value at issue time.
          </p>
          <select
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="PERCENT">Percentage Off</option>
            <option value="FIXED">Fixed Amount Off (₹)</option>
          </select>
          <input
            type="number"
            value={form.discountValue}
            onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Discount value"
          />
          <button
            onClick={() =>
              updateSettings.mutate({
                discountType: form.discountType,
                discountValue: parseFloat(form.discountValue),
              })
            }
            disabled={updateSettings.isPending}
            className="px-4 py-2 bg-primaryRed text-white rounded-lg"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
