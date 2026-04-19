"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { materialService, testService } from "@/services/api";
import Card from "@/components/Card";
import Loader from "@/components/Loader";

export default function TeacherDashboard() {
  const [materials, setMaterials] = useState([]);
  const [tests, setTests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      loadData(u.id);
    }
  }, []);

  const loadData = async (teacherId) => {
    try {
      const [matRes, testRes] = await Promise.all([
        materialService.getAll({ teacher: teacherId }),
        testService.getAll({ teacher: teacherId }),
      ]);
      setMaterials(matRes.data);
      setTests(testRes.data);
    } catch (err) {
      console.error("Failed to load teacher data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Teacher Dashboard</h1>
          <p className="text-slate-500">Welcome, {user?.first_name || "Teacher"}. Manage your content.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/teacher/upload" className="px-5 py-2.5 bg-white text-blue-600 border border-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-sm">
            + Material
          </Link>
          <Link href="/dashboard/teacher/manage-tests" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
            + Test
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Materials Uploaded" value={materials.length} color="text-blue-600" />
        <Card title="Tests Created" value={tests.length} color="text-emerald-600" />
        <Card title="Total Students" value="—" color="text-slate-900" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Recent Materials</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {materials.map((m) => (
            <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-slate-900">{m.title}</p>
                <p className="text-sm text-slate-500">{m.subject} • {new Date(m.created_at).toLocaleString()}</p>
              </div>
              <span className="text-blue-600 text-xs font-medium bg-blue-50 px-3 py-1 rounded-full">Active</span>
            </div>
          ))}
          {materials.length === 0 && (
            <div className="p-6 text-slate-400 text-center">No materials uploaded yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
