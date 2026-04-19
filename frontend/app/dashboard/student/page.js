"use client";
import { useEffect, useState } from "react";
import { materialService, testService } from "@/services/api";
import Card from "@/components/Card";
import Loader from "@/components/Loader";

export default function StudentDashboard() {
  const [materials, setMaterials] = useState([]);
  const [tests, setTests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [matRes, testRes] = await Promise.all([
        materialService.getAll(),
        testService.getAll(),
      ]);
      setMaterials(matRes.data);
      setTests(testRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Hello, {user?.first_name || "Student"}! 👋
      </h1>
      <p className="text-slate-500 mb-8">
        Here is your progress for the CBSE Boards.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Tests Available" value={tests.length} color="text-slate-900" />
        <Card title="Materials Available" value={materials.length} color="text-blue-600" />
        <Card title="Average Score" value="—" color="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tests */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Mock Tests</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            {tests.map((test) => (
              <div key={test.id} className="border-b border-slate-100 p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900">{test.title}</p>
                  <p className="text-sm text-slate-500">{test.question_count} questions • {test.duration_minutes} mins</p>
                </div>
                <a href={`/tests/${test.id}`} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Start
                </a>
              </div>
            ))}
            {tests.length === 0 && (
              <div className="p-6 text-slate-400 text-center">No tests available yet</div>
            )}
          </div>
        </div>

        {/* Materials */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Materials</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
            {materials.slice(0, 5).map((mat) => (
              <a key={mat.id} href={mat.file_url || mat.file || "#"} target="_blank" rel="noreferrer"
                className="flex gap-3 items-center hover:bg-slate-50 p-2 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                  {mat.subject?.slice(0, 3).toUpperCase() || "DOC"}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{mat.title}</p>
                  <p className="text-xs text-slate-400">{new Date(mat.created_at).toLocaleDateString()}</p>
                </div>
              </a>
            ))}
            {materials.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No materials yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
