"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { materialService } from "@/services/api";
import { FiUpload } from "react-icons/fi";

export default function UploadMaterial() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("physics");
  const [classLevel, setClassLevel] = useState("12");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subject", subject);
    formData.append("class_level", classLevel);
    if (file) formData.append("file", file);

    try {
      await materialService.create(formData);
      router.push("/dashboard/teacher");
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Upload Study Material</h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <form className="space-y-6" onSubmit={handleUpload}>
          {/* File Dropzone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex justify-center px-6 py-10 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer bg-slate-50"
            >
              <div className="space-y-2 text-center">
                <FiUpload className="mx-auto text-3xl text-slate-400" />
                <p className="text-sm text-slate-600">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-slate-400">PDF, DOCX, PPT up to 10MB</p>
              </div>
            </div>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.pptx,.doc,.ppt"
              onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
              <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                <option value="10">Class 10</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="mathematics">Mathematics</option>
                <option value="biology">Biology</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Current Electricity Notes" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Optional details about this material" />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={() => router.push("/dashboard/teacher")}
              className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm disabled:opacity-50">
              {loading ? "Uploading..." : "Upload Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
