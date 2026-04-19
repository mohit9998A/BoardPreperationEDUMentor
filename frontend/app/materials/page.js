"use client";
import { useEffect, useState } from "react";
import { materialService } from "@/services/api";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ subject: "", class_level: "" });

  useEffect(() => {
    loadMaterials();
  }, [filter]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.subject) params.subject = filter.subject;
      if (filter.class_level) params.class_level = filter.class_level;
      const { data } = await materialService.getAll(params);
      setMaterials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Study Materials</h1>
        <p className="text-slate-500 mb-8">Browse and download study materials for your exams.</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select value={filter.subject} onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
            <option value="">All Subjects</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="mathematics">Mathematics</option>
            <option value="biology">Biology</option>
          </select>
          <select value={filter.class_level} onChange={(e) => setFilter({ ...filter, class_level: e.target.value })}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
            <option value="">All Classes</option>
            <option value="10">Class 10</option>
            <option value="12">Class 12</option>
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((mat) => (
              <div key={mat.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                    {mat.subject?.slice(0, 3).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-400 capitalize">Class {mat.class_level}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{mat.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{mat.description || "No description"}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">By {mat.teacher_name}</span>
                  {(mat.file || mat.file_url) && (
                    <a href={mat.file || mat.file_url} target="_blank" rel="noreferrer"
                      className="text-sm text-blue-600 font-medium hover:underline">
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400">No materials found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
