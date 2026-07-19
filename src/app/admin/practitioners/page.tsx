"use client";
import { useState } from "react";
import AdminTabs from "@/components/ui/AdminTabs";
import {
  useAdminPractitioners,
  useCreatePractitioner,
  useUpdatePractitioner,
} from "@/hooks/admin/useAdminPractitioners";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";

export default function AdminPractitionersPage() {
  const { data, isLoading } = useAdminPractitioners();
  const createPractitioner = useCreatePractitioner();
  const updatePractitioner = useUpdatePractitioner();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createPractitioner.mutate(form, {
      onSuccess: () => {
        setShowForm(false);
        setForm({ name: "", email: "", phone: "", specialization: "", password: "" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const practitioners = data?.practitioners || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <AdminTabs activeTab="practitioners" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Practitioners</h1>
            <p className="text-gray-600 mt-1">Manage guidance call practitioners</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primaryRed text-white rounded-lg"
          >
            {showForm ? "Cancel" : "Add Practitioner"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-lg border p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border rounded-lg px-3 py-2" />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded-lg px-3 py-2" />
              <input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="border rounded-lg px-3 py-2" />
              <input required type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" />
            </div>
            <button type="submit" disabled={createPractitioner.isPending} className="px-4 py-2 bg-primaryRed text-white rounded-lg">
              Create Practitioner
            </button>
          </form>
        )}

        <div className="bg-white rounded-lg border divide-y">
          {practitioners.map((p: { id: string; name: string; email: string; phone?: string; specialization?: string; active: boolean }) => (
            <div key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-600">{p.email}</p>
                {p.specialization && <p className="text-sm text-gray-500">{p.specialization}</p>}
              </div>
              <button
                onClick={() => updatePractitioner.mutate({ id: p.id, active: !p.active })}
                className={`px-3 py-1 rounded-full text-xs font-medium ${p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
              >
                {p.active ? "Active" : "Inactive"}
              </button>
            </div>
          ))}
          {practitioners.length === 0 && (
            <p className="p-8 text-center text-gray-500">No practitioners yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
