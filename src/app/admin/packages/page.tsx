import AdminTabs from "@/components/ui/AdminTabs";
import PackagesTable from "@/components/admin/Packages/PackagesTable";

export default function AdminPackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="packages" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Ritual Packages</h1>
          <p className="text-gray-600 mt-1">
            Track purchased packages and schedule their ritual support sessions
          </p>
        </div>
        <PackagesTable />
      </div>
    </div>
  );
}
