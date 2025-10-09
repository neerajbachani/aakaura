"use client";
import { useDashboardStats } from "@/hooks/admin/useAdminDashboard";
import AdminTabs from "@/components/ui/AdminTabs";
import StatsCard from "@/components/admin/Dashboard/StatsCard";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";
import OrderStatusBadge from "@/components/admin/Orders/OrderStatusBadge";
import { FaDollarSign, FaShoppingBag, FaUsers, FaBox, FaEye } from "react-icons/fa";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="dashboard" />
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="dashboard" />
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load dashboard data</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, pendingOrders, recentOrders } = dashboardData!;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="dashboard" />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={`₹${stats.revenue.current.toLocaleString()}`}
            change={{
              value: stats.revenue.change,
              type: stats.revenue.change >= 0 ? "increase" : "decrease"
            }}
            icon={FaDollarSign}
            color="green"
          />
          <StatsCard
            title="Total Orders"
            value={stats.orders.current}
            change={{
              value: stats.orders.change,
              type: stats.orders.change >= 0 ? "increase" : "decrease"
            }}
            icon={FaShoppingBag}
            color="blue"
          />
          <StatsCard
            title="New Users"
            value={stats.users.current}
            change={{
              value: stats.users.change,
              type: stats.users.change >= 0 ? "increase" : "decrease"
            }}
            icon={FaUsers}
            color="purple"
          />
          <StatsCard
            title="Total Products"
            value={stats.products.total}
            icon={FaBox}
            color="yellow"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Orders</span>
                <Link 
                  href="/admin/orders?status=PENDING"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  {pendingOrders}
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Products In Stock</span>
                <span className="text-green-600 font-medium">{stats.products.inStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Out of Stock</span>
                <span className="text-red-600 font-medium">{stats.products.outOfStock}</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link 
                href="/admin/orders"
                className="text-primaryRed hover:text-primaryRed/80 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{order.orderNumber}</span>
                      <OrderStatusBadge status={order.status as any} />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{order.itemsCount} items</p>
                  </div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="ml-4 p-2 text-gray-400 hover:text-primaryRed transition-colors"
                  >
                    <FaEye />
                  </Link>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/orders?status=PENDING"
              className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <FaShoppingBag className="text-orange-600" />
              <span className="font-medium text-orange-700">Pending Orders</span>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FaBox className="text-blue-600" />
              <span className="font-medium text-blue-700">Add Product</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FaUsers className="text-purple-600" />
              <span className="font-medium text-purple-700">Manage Users</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FaDollarSign className="text-green-600" />
              <span className="font-medium text-green-700">View Analytics</span>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}