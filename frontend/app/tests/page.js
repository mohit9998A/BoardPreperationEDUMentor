"use client";
import { useEffect, useState } from "react";
import { testService } from "@/services/api";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function TestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testService.getAll().then(({ data }) => setTests(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mock Tests</h1>
        <p className="text-slate-500 mb-8">Practice with real exam patterns and get instant scores.</p>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{test.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {test.question_count} questions • {test.duration_minutes} mins • By {test.teacher_name}
                  </p>
                </div>
                <Link href={`/tests/${test.id}`}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center">
                  Start Test
                </Link>
              </div>
            ))}
            {tests.length === 0 && (
              <div className="text-center py-16 text-slate-400">No tests available yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
