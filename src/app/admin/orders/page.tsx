"use client";
import AdminTabs from "@/components/ui/AdminTabs";
import OrdersTable from "@/components/admin/Orders/OrdersTable";

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="orders" />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage customer orders and track fulfillment</p>
        </div>

        {/* Orders Table */}
        <OrdersTable />
      </div>
    </div>
  );
}