"use client";
import { useEffect, useState } from "react";

export default function AdminTestPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const testAPIs = async () => {
      try {
        // Test dashboard API
        const dashboardRes = await fetch("/api/admin/dashboard", {
          credentials: "include"
        });
        
        if (dashboardRes.ok) {
          const dashboardResult = await dashboardRes.json();
          setDashboardData(dashboardResult);
        } else {
          setError(`Dashboard API failed: ${dashboardRes.status}`);
        }

        // Test users API
        const usersRes = await fetch("/api/admin/users?page=1&limit=5", {
          credentials: "include"
        });
        
        if (usersRes.ok) {
          const usersResult = await usersRes.json();
          setUsersData(usersResult);
        } else {
          setError(prev => prev + ` | Users API failed: ${usersRes.status}`);
        }

      } catch (err) {
        setError(`Network error: ${err}`);
      }
    };

    testAPIs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin API Test</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard API</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {dashboardData ? JSON.stringify(dashboardData, null, 2) : "Loading..."}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Users API</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {usersData ? JSON.stringify(usersData, null, 2) : "Loading..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}