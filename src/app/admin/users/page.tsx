"use client";
import AdminTabs from "@/components/ui/AdminTabs";
import UsersTable from "@/components/admin/Users/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="users" />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage customer accounts and user data</p>
        </div>

        {/* Users Table */}
        <UsersTable />
      </div>
    </div>
  );
}