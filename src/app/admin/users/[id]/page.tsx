"use client";
import { useUser, useToggleUserStatus } from "@/hooks/admin/useAdminUsers";
import AdminTabs from "@/components/ui/AdminTabs";
import UserStatusBadge from "@/components/admin/Users/UserStatusBadge";
import OrderStatusBadge from "@/components/admin/Orders/OrderStatusBadge";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";
import Link from "next/link";
import { FaArrowLeft, FaToggleOn, FaToggleOff, FaEye, FaMapMarkerAlt, FaPhone, FaCalendar, FaShoppingBag } from "react-icons/fa";

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { data: user, isLoading, error } = useUser(params.id);
  const toggleUserStatus = useToggleUserStatus();

  const handleToggleStatus = () => {
    if (user) {
      toggleUserStatus.mutate({
        userId: user.id,
        isActive: !user.isActive
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="users" />
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="users" />
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load user details</p>
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-primaryRed text-white rounded-lg hover:bg-primaryRed/90"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="users" />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin/users"
              className="p-2 text-gray-600 hover:text-primaryRed rounded-lg hover:bg-white"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
              <p className="text-gray-600 mt-1">Manage user account and view activity</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || user.email}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primaryRed/10 flex items-center justify-center mx-auto">
                    <span className="text-primaryRed font-bold text-2xl">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mt-4">
                  {user.name || "No Name"}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <UserStatusBadge isActive={user.isActive} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "ADMIN" 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.emailVerified 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {user.emailVerified ? "Verified" : "Pending"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-sm" />
                  <span>{user.phone || "No phone number"}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendar className="text-sm" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>

                {user.lastLoginAt && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">Last login: {formatDate(user.lastLoginAt)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleStatus}
                    disabled={toggleUserStatus.isPending}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium ${
                      user.isActive
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaShoppingBag className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{user._count.orders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-green-600 font-bold">₹</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(user.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FaMapMarkerAlt className="text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Addresses</p>
                    <p className="text-2xl font-bold text-gray-900">{user.addresses.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              </div>
              <div className="p-6">
                {user.orders.length > 0 ? (
                  <div className="space-y-4">
                    {user.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">{order.orderNumber}</span>
                            <OrderStatusBadge status={order.status as any} />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items • {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                        </div>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="ml-4 p-2 text-gray-400 hover:text-primaryRed transition-colors"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📦</div>
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
              </div>
              <div className="p-6">
                {user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <div key={address.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {address.firstName} {address.lastName}
                          </h4>
                          {address.isDefault && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.address}<br />
                          {address.city}, {address.state} {address.zipCode}<br />
                          {address.country}
                        </p>
                        {address.phone && (
                          <p className="text-sm text-gray-600 mt-2">
                            <FaPhone className="inline mr-1" />
                            {address.phone}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📍</div>
                    <p className="text-gray-500">No addresses saved</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}