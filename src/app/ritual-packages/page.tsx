"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { toast } from "react-hot-toast";
import { useAuthStatus } from "@/hooks/useAuth";
import { PACKAGES } from "@/config/guidance";
import { PackageType } from "@prisma/client";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (r: { error: { description: string } }) => void) => void };
  }
}

const PACKAGE_ORDER: PackageType[] = ["PACKAGE_I", "PACKAGE_II", "PACKAGE_III"];

export default function RitualPackagesPage() {
  const { user } = useAuthStatus();
  const [activePackages, setActivePackages] = useState<Array<{
    id: string;
    packageType: PackageType;
    label: string;
    remainingCalls: number;
    expiryDate?: string;
    status: string;
  }>>([]);
  const [couponCode, setCouponCode] = useState("");
  const [purchasing, setPurchasing] = useState<PackageType | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      fetch("/api/guidance/packages", { credentials: "include" })
        .then((r) => r.json())
        .then((data) => setActivePackages(data.packages || []));
    }
  }, [user]);

  const finalizePurchase = async (
    packageType: PackageType,
    appliedCoupon: string | undefined,
    paymentResponse?: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
  ) => {
    const pkg = PACKAGES[packageType];
    const purchaseRes = await fetch("/api/guidance/purchase-package", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageType,
        ...form,
        couponCode: appliedCoupon,
        ...(paymentResponse
          ? {
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            }
          : {}),
      }),
    });
    const result = await purchaseRes.json();
    if (!purchaseRes.ok) {
      toast.error(result.error || "Purchase failed");
      return;
    }
    toast.success("Package purchased! Our team will schedule your sessions.");
    setActivePackages((prev) => [
      {
        id: result.packagePurchase.id,
        packageType,
        label: pkg.label,
        remainingCalls: pkg.calls,
        status: "ACTIVE",
      },
      ...prev,
    ]);
  };

  const purchasePackage = async (packageType: PackageType) => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in your contact details");
      return;
    }

    // Coupons are redeemable on Package I only; ignore any code for other packages.
    const appliedCoupon =
      packageType === "PACKAGE_I" && couponCode ? couponCode : undefined;

    setPurchasing(packageType);
    try {
      const createRes = await fetch("/api/guidance/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "package",
          packageType,
          customerInfo: form,
          couponCode: appliedCoupon,
        }),
      });
      const rzpData = await createRes.json();
      if (!createRes.ok) {
        toast.error(rzpData.error || "Failed to initialize payment");
        return;
      }

      // Coupon fully covered the price: no Razorpay checkout needed.
      if (rzpData.free) {
        await finalizePurchase(packageType, appliedCoupon);
        return;
      }

      const pkg = PACKAGES[packageType];
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: "Aakaura",
        description: pkg.label,
        order_id: rzpData.id,
        handler: async (paymentResponse: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          await finalizePurchase(packageType, appliedCoupon, paymentResponse);
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#BD9958" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => toast.error(r.error.description || "Payment failed"));
      rzp.open();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-[#27190B] py-12 pt-28">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-cormorant text-[#BD9958] mb-2 text-center">
            Ritual Support Packages
          </h1>
          <p className="text-[#F5E6D3]/80 text-center mb-8">
            Continue your journey with guided ritual support
          </p>

          {activePackages.length > 0 && (
            <div className="mb-8 bg-[#F5E6D3]/10 rounded-xl p-6 border border-[#BD9958]/20">
              <h2 className="text-[#BD9958] font-medium mb-3">Your Active Packages</h2>
              {activePackages
                .filter((p) => p.status === "ACTIVE" && p.remainingCalls > 0)
                .map((p) => (
                  <div key={p.id} className="text-[#F5E6D3] text-sm mb-2">
                    {p.label} · <strong>{p.remainingCalls}</strong> call(s) remaining
                    {p.expiryDate && ` · Expires ${new Date(p.expiryDate).toLocaleDateString("en-IN")}`}
                  </div>
                ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PACKAGE_ORDER.map((type) => {
              const pkg = PACKAGES[type];
              return (
                <div key={type} className="bg-[#F5E6D3]/10 rounded-xl p-6 border border-[#BD9958]/20 flex flex-col">
                  <h3 className="text-[#BD9958] font-cormorant text-xl mb-1">{pkg.label}</h3>
                  <p className="text-2xl font-bold text-[#F5E6D3] mb-2">₹{pkg.price}</p>
                  <p className="text-sm text-[#F5E6D3]/70 mb-4 flex-1">{pkg.description}</p>
                  <ul className="text-xs text-[#F5E6D3]/60 mb-4 space-y-1">
                    <li>{pkg.calls} call{pkg.calls > 1 ? "s" : ""} · {pkg.durationMinutes} min each</li>
                    {pkg.validityDays && <li>Valid for {pkg.validityDays} days</li>}
                    {type === "PACKAGE_I" ? (
                      <li className="text-[#BD9958]">Coupons are redeemable here</li>
                    ) : (
                      <li className="text-[#F5E6D3]/40">Coupons do not apply to this package</li>
                    )}
                  </ul>
                  <button
                    onClick={() => purchasePackage(type)}
                    disabled={purchasing === type}
                    className="w-full py-3 bg-[#BD9958] text-[#27190B] font-semibold rounded-lg hover:bg-[#BD9958]/90 disabled:opacity-50"
                  >
                    {purchasing === type ? "Processing..." : "Purchase"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-[#F5E6D3]/10 rounded-xl p-6 border border-[#BD9958]/20 max-w-md mx-auto">
            <h3 className="text-[#BD9958] mb-3">Contact & Coupon</h3>
            <div className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/90 rounded-lg px-4 py-2 text-[#27190B] text-sm" />
              <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/90 rounded-lg px-4 py-2 text-[#27190B] text-sm" />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-white/90 rounded-lg px-4 py-2 text-[#27190B] text-sm" />
              <input placeholder="Coupon code (Package I only)" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} className="w-full bg-white/90 rounded-lg px-4 py-2 text-[#27190B] text-sm font-mono" />
            </div>
            <p className="text-xs text-[#F5E6D3]/60 mt-3">
              Coupons issued after a qualifying product purchase are redeemable on Ritual Package I only.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
