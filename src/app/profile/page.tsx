"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuth";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  MapPinIcon,
  HeartIcon,
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Aurora from "@/components/ui/Aurora";

type TabType = "profile" | "orders" | "addresses" | "waitlist";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStatus();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", "/profile");
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD9958]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  const tabs = [
    { id: "profile", name: "Altar & Details", icon: UserCircleIcon },
    { id: "orders", name: "My Order Journey", icon: ShoppingBagIcon },
    { id: "addresses", name: "Sanctuaries", icon: MapPinIcon },
    { id: "waitlist", name: "My Waitlist", icon: HeartIcon },
  ];

  return (
    <div className="relative min-h-screen bg-[] text-white py-12 font-sans overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <Aurora
          colorStops={["#BD9958", "#000000", "#3E5EEC", "#000000", "#FFD700"]}
          amplitude={1.2}
          blend={0.6}
          speed={0.3}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Header with Navigation Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <button
              onClick={() => router.back()}
              className="group flex items-center text-sm font-medium text-white/50 hover:text-[#BD9958] transition-colors mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Return
            </button>
            <h1 className="text-4xl sm:text-5xl font-cormorant font-medium text-white tracking-tight">
              YOUR <span className="text-[#BD9958]">AAKAURA.</span>
            </h1>
            <p className="text-white/60 mt-3 text-lg font-light tracking-wide">
              Enter your realm. Manage your tools, sanctuary, and journey.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center px-6 py-3 border border-[#BD9958]/30 rounded-none shadow-sm text-base font-cormorant tracking-widest uppercase text-[#BD9958] bg-black/40 hover:bg-[#BD9958] hover:text-black transition-all hover:scale-105 backdrop-blur-md"
          >
            Continue Journey
            <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/4">
            <nav className="flex flex-col space-y-3 bg-black/40 backdrop-blur-md p-6 rounded-none border border-white/5 shadow-2xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center px-4 py-4 text-sm tracking-widest uppercase font-cormorant transition-all duration-500 border-l-[3px] ${
                      isActive
                        ? "bg-white/5 text-[#BD9958] border-[#BD9958]"
                        : "text-white/50 hover:bg-white/5 hover:text-white border-transparent hover:border-white/20"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mr-3 transition-colors duration-500 ${isActive ? "text-[#BD9958]" : "text-white/40"}`}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl p-6 md:p-10 min-h-[600px] relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#BD9958]/10 blur-[50px] rounded-full pointer-events-none -mt-10 -mr-10"></div>

              {activeTab === "profile" && <ProfileTab user={user} />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "addresses" && <AddressesTab userId={user.id} />}
              {activeTab === "waitlist" && <WaitlistTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TABS COMPONENTS ---

function ProfileTab({ user }: { user: any }) {
  const [inferredPhone, setInferredPhone] = useState<string | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(user.phone || "");
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Fetch addresses to find a phone number if the user doesn't have one set directly
  useEffect(() => {
    if (!user.phone) {
      fetch("/api/user/addresses")
        .then((res) => res.json())
        .then((data) => {
          if (data.addresses && data.addresses.length > 0) {
            // Find the first address that has a phone number
            const addressWithPhone = data.addresses.find((a: any) => a.phone);
            if (addressWithPhone) {
              setInferredPhone(addressWithPhone.phone);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user.phone]);

  const displayPhone = user.phone || inferredPhone;

  const handleSavePhone = async () => {
    setIsSavingPhone(true);
    setPhoneError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: phoneInput,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.details ||
            errData.error ||
            "Failed to update connection number",
        );
      }

      // Update local state to reflect change immediately without full reload
      user.phone = phoneInput;
      setIsEditingPhone(false);
    } catch (err: any) {
      setPhoneError(err.message);
    } finally {
      setIsSavingPhone(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn relative z-10">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10 pb-10 border-b border-white/10 flex-wrap">
        <div className="h-28 w-28 bg-gradient-to-tr from-[#BD9958]/20 to-[#BD9958]/5 border border-[#BD9958]/30 rounded-full flex items-center justify-center text-[#BD9958] text-4xl font-cormorant shadow-[0_0_30px_rgba(189,153,88,0.15)] flex-shrink-0">
          {user.name?.[0] || user.email?.[0] || "?"}
        </div>
        <div className="text-center md:text-left mt-2 flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-cormorant text-white tracking-wider">
                {user.name || "Seeker"}
              </h2>
              <p className="text-white/50 font-light mt-1">{user.email}</p>
              <span className="mt-4 inline-flex items-center px-3 py-1 rounded-none text-xs tracking-widest uppercase font-cormorant border border-green-500/30 bg-green-500/10 text-green-400">
                Aura Activated
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group border border-white/5 bg-white/5 p-6 hover:border-[#BD9958]/30 transition-colors duration-500">
          <p className="text-xs uppercase tracking-widest text-[#BD9958] mb-2 font-cormorant">
            True Name
          </p>
          <p className="text-xl text-white font-light">{user.name || "-"}</p>
        </div>
        <div className="group border border-white/5 bg-white/5 p-6 hover:border-[#BD9958]/30 transition-colors duration-500">
          <p className="text-xs uppercase tracking-widest text-[#BD9958] mb-2 font-cormorant">
            Ethereal Mail
          </p>
          <p className="text-xl text-white font-light">{user.email}</p>
        </div>
        <div className="group border border-white/5 bg-white/5 p-6 hover:border-[#BD9958]/30 transition-colors duration-500 md:col-span-2 relative">
          <p className="text-xs uppercase tracking-widest text-[#BD9958] mb-2 font-cormorant flex items-center justify-between">
            <span>Connection Number</span>
            {!isEditingPhone && (
              <button
                onClick={() => {
                  setPhoneInput(user.phone || "");
                  setIsEditingPhone(true);
                }}
                className="text-white/40 hover:text-[#BD9958] transition-colors flex items-center"
              >
                <PencilIcon className="w-3 h-3 mr-1" />{" "}
                {displayPhone ? "Change" : "Add Number"}
              </button>
            )}
          </p>

          {isEditingPhone ? (
            <div className="mt-2 text-xl font-light">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. +1 234 567 8900"
                  className="bg-black/50 border-b border-[#BD9958]/50 focus:border-[#BD9958] outline-none px-2 py-1 text-white text-lg w-full sm:w-auto"
                />
                <div className="flex gap-2 items-center">
                  <button
                    onClick={handleSavePhone}
                    disabled={isSavingPhone}
                    className="text-white text-sm bg-[#BD9958] px-3 py-1 font-cormorant tracking-widest uppercase hover:bg-[#FFD700] hover:text-black transition-colors disabled:opacity-50"
                  >
                    {isSavingPhone ? "Binding..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPhone(false);
                      setPhoneError("");
                    }}
                    className="text-white/40 text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              {phoneError && (
                <p className="text-red-400 text-xs mt-2">{phoneError}</p>
              )}
            </div>
          ) : (
            <p className="text-xl text-white font-light">
              {displayPhone ? (
                <span>
                  {displayPhone}
                  {inferredPhone && !user.phone && (
                    <span className="ml-3 text-xs text-white/40 italic font-sans align-middle">
                      (Fetched from stored sanctuary)
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-white/30 italic text-base">
                  No connection tied to your aura.
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-white/5 w-1/3"></div>
        <div className="h-32 bg-white/5 w-full"></div>
      </div>
    );

  return (
    <div className="animate-fadeIn relative z-10">
      <h2 className="text-3xl font-cormorant text-white tracking-widest mb-8 uppercase text-center sm:text-left">
        Journey Logs
      </h2>
      {orders.length === 0 ? (
        <div className="text-center py-16 border border-white/10 bg-white/5">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-[#BD9958]/40 mb-4" />
          <h3 className="text-lg font-cormorant text-white tracking-wider">
            No journeys yet.
          </h3>
          <p className="mt-2 text-white/50 font-light">
            Your path awaits. Discover tools to align your energy.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-white/10 bg-black/50 hover:border-[#BD9958]/40 transition-colors duration-500 overflow-hidden group"
            >
              <div className="bg-white/5 px-6 py-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-[#BD9958] font-cormorant mb-1">
                    Scroll ID
                  </p>
                  <p className="text-white font-light">
                    {order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-[#BD9958] font-cormorant mb-1">
                    Time Marked
                  </p>
                  <p className="text-white font-light">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-[#BD9958] font-cormorant mb-1">
                    Exchange
                  </p>
                  <p className="text-white font-light">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex flex-col items-center px-3 py-1 text-xs tracking-widest uppercase font-cormorant border ${
                      order.status === "DELIVERED"
                        ? "border-green-500/30 text-green-400 bg-green-500/10"
                        : order.status === "PENDING"
                          ? "border-[#BD9958]/30 text-[#BD9958] bg-[#BD9958]/10"
                          : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                    }`}
                  >
                    {order.status.toLowerCase()}
                  </span>
                </div>
              </div>
              <ul className="divide-y divide-white/10 px-6 py-2">
                {order.items?.map((item: any) => (
                  <li
                    key={item.id}
                    className="py-4 flex justify-between items-center group-hover:bg-white/[0.02] -mx-6 px-6 transition-colors"
                  >
                    <span className="text-white flex items-center font-light">
                      <span className="text-[#BD9958] font-cormorant text-lg mr-3">
                        {item.quantity}x
                      </span>
                      {item.productName || item.product?.name || "Artifact"}
                      {item.variationName && (
                        <span className="text-white/40 ml-2 text-sm text-italic">
                          ({item.variationName})
                        </span>
                      )}
                    </span>
                    <span className="text-white/80 font-light">
                      ${item.price.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesTab({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchAddresses = () => {
    setLoading(true);
    fetch("/api/user/addresses")
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data.addresses || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Dissolve this sanctuary from your records?")) return;
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !isAdding && !editingId)
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-white/5 w-1/3"></div>
        <div className="h-40 bg-white/5 w-full"></div>
      </div>
    );

  return (
    <div className="animate-fadeIn relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <h2 className="text-3xl font-cormorant text-white tracking-widest uppercase text-center sm:text-left">
          Your Sanctuaries
        </h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-5 py-2.5 border border-[#BD9958] text-[#BD9958] bg-transparent hover:bg-[#BD9958] hover:text-black shadow-[0_0_15px_rgba(189,153,88,0.2)] hover:shadow-[0_0_20px_rgba(189,153,88,0.4)] text-sm font-cormorant uppercase tracking-widest transition-all duration-300"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Establish New
          </button>
        )}
      </div>

      {isAdding || editingId ? (
        <AddressForm
          address={editingId ? addresses.find((a) => a.id === editingId) : null}
          onSuccess={() => {
            setIsAdding(false);
            setEditingId(null);
            fetchAddresses();
          }}
          onCancel={() => {
            setIsAdding(false);
            setEditingId(null);
          }}
        />
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 border border-white/10 bg-white/5">
          <MapPinIcon className="mx-auto h-12 w-12 text-[#BD9958]/40 mb-4" />
          <h3 className="text-lg font-cormorant text-white tracking-wider">
            No sanctuaries established.
          </h3>
          <p className="mt-2 text-white/50 font-light">
            Add a destination for your artifacts to arrive.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative border border-white/10 bg-white/[0.03] p-8 hover:border-[#BD9958]/50 transition-colors duration-500 overflow-hidden group"
            >
              {address.isDefault && (
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <span className="text-[#BD9958] font-cormorant uppercase tracking-widest text-xs border border-[#BD9958]/30 px-3 py-1 bg-[#BD9958]/10">
                    Primary
                  </span>
                </div>
              )}
              <h3 className="font-cormorant text-2xl text-[#BD9958] tracking-wide mb-3">
                {address.firstName} {address.lastName}
              </h3>
              <div className="text-white/70 font-light grid gap-1.5 mb-8">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                {/* <p className="text-white/40">{address.country}</p> */}
                {address.phone && (
                  <p className="pt-2 text-[#BD9958]/80 text-sm mt-1">
                    {address.phone}
                  </p>
                )}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 flex gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-black via-black/80 to-transparent">
                <button
                  onClick={() => setEditingId(address.id)}
                  className="text-white hover:text-[#BD9958] text-xs uppercase tracking-widest font-cormorant flex items-center transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" /> Modify
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-white/50 hover:text-red-400 text-xs uppercase tracking-widest font-cormorant flex items-center transition-colors ml-4"
                >
                  <TrashIcon className="h-4 w-4 mr-2" /> Dissolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({
  address,
  onSuccess,
  onCancel,
}: {
  address?: any;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: address?.firstName || "",
    lastName: address?.lastName || "",
    address: address?.address || "",
    city: address?.city || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
    country: address?.country || "US",
    phone: address?.phone || "",
    isDefault: address?.isDefault || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = address
        ? `/api/user/addresses/${address.id}`
        : "/api/user/addresses";
      const method = address ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || data.details?.[0]?.message || "Failed to establish.",
        );
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full bg-black/50 border-b border-white/20 focus:border-[#BD9958] focus:ring-0 py-3 px-1 text-white font-light transition-colors placeholder-white/20 outline-none";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-[#BD9958] font-cormorant mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/[0.02] border border-white/10 p-8"
    >
      <h3 className="text-2xl font-cormorant text-white mb-8 tracking-wider">
        {address ? "Modify" : "Establish"} Sanctuary
      </h3>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-sm font-light">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className={labelClasses}>Given Name</label>
          <input
            required
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={inputClasses}
            placeholder="Your first name"
          />
        </div>
        <div>
          <label className={labelClasses}>Ancestral Name</label>
          <input
            required
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className={inputClasses}
            placeholder="Your last name"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClasses}>Earth Location</label>
          <input
            required
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className={inputClasses}
            placeholder="Street address"
          />
        </div>
        <div>
          <label className={labelClasses}>City / Town</label>
          <input
            required
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={inputClasses}
            placeholder="Your city"
          />
        </div>
        <div>
          <label className={labelClasses}>State / Province</label>
          <input
            required
            type="text"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className={inputClasses}
            placeholder="Your state"
          />
        </div>
        <div>
          <label className={labelClasses}>Area Code</label>
          <input
            required
            type="text"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            className={inputClasses}
            placeholder="Postal code"
          />
        </div>
        <div>
          <label className={labelClasses}>Connection Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={inputClasses}
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center group">
        <input
          id="isDefault"
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) =>
            setFormData({ ...formData, isDefault: e.target.checked })
          }
          className="h-5 w-5 bg-black/50 border-white/20 checked:bg-[#BD9958] checked:border-[#BD9958] focus:ring-0 cursor-pointer appearance-none checked:after:content-['✓'] checked:after:text-black flex items-center justify-center text-sm font-bold transition-all"
        />
        <label
          htmlFor="isDefault"
          className="ml-3 block text-sm text-white/70 font-light cursor-pointer group-hover:text-white transition-colors"
        >
          Mark as primary destination
        </label>
      </div>

      <div className="mt-10 pt-8 border-t border-white/10 flex justify-end gap-6">
        <button
          type="button"
          onClick={onCancel}
          className="text-white/50 hover:text-white text-sm font-cormorant uppercase tracking-widest transition-colors"
        >
          Withdraw
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#BD9958] hover:bg-[#FFD700] text-black font-cormorant uppercase tracking-widest shadow-[0_0_15px_rgba(189,153,88,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all disabled:opacity-50 disabled:hover:bg-[#BD9958] disabled:hover:shadow-[0_0_15px_rgba(189,153,88,0.3)]"
        >
          {saving ? "Channeling..." : "Seal Pact"}
        </button>
      </div>
    </form>
  );
}

function WaitlistTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWaitlist = () => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.waitlistItems || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const handleRemove = async (item: any) => {
    try {
      const res = await fetch(
        `/api/waitlist?journeySlug=${item.journeySlug}&productId=${item.productId}&clientType=${item.clientType}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) fetchWaitlist();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-white/5 w-1/3"></div>
        <div className="h-40 bg-white/5 w-full"></div>
      </div>
    );

  return (
    <div className="animate-fadeIn relative z-10">
      <h2 className="text-3xl font-cormorant text-white tracking-widest uppercase mb-8 border-b border-white/10 pb-6 text-center sm:text-left">
        Longing For
      </h2>
      {items.length === 0 ? (
        <div className="text-center py-16 border border-white/10 bg-white/5">
          <HeartIcon className="mx-auto h-12 w-12 text-[#BD9958]/40 mb-4" />
          <h3 className="text-lg font-cormorant text-white tracking-wider">
            No artifacts awaited.
          </h3>
          <p className="mt-2 text-white/50 font-light">
            Your desires will manifest here when marked.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-white/10 bg-white/[0.02] p-8 hover:border-[#BD9958]/40 hover:bg-white/[0.04] transition-all duration-500 group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[#BD9958] font-cormorant uppercase tracking-widest text-xs border border-[#BD9958]/30 px-3 py-1 bg-[#BD9958]/10 mb-4">
                  {item.journeySlug} Realm
                </span>
                <h3 className="font-cormorant text-2xl text-white tracking-wide line-clamp-2 leading-snug">
                  {item.productName}
                </h3>
                <p className="text-sm text-white/50 capitalize mt-3 font-light pl-3 border-l-[1px] border-[#BD9958]/50 italic">
                  path: {item.clientType.replace("-", " ")}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-white/30 font-light">
                  Spotted {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleRemove(item)}
                  className="text-red-400 hover:text-red-300 text-xs font-cormorant uppercase tracking-widest flex items-center opacity-50 hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-4 w-4 mr-2" /> Release
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
