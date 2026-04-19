"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { testService } from "@/services/api";
import Loader from "@/components/Loader";

export default function TestEnginePage() {
  const { id } = useParams();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testService.getById(id)
      .then(({ data }) => {
        setTest(data);
        setTimeLeft(data.duration_minutes * 60);
      })
      .catch(() => router.push("/tests"))
      .finally(() => setLoading(false));
  }, [id, router]);

  // Countdown timer
  useEffect(() => {
    if (!test || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, submitted]);

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      const { data } = await testService.submit(id, answers);
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  }, [id, answers, submitted]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) return <Loader />;
  if (!test) return null;

  const questions = test.questions || [];
  const q = questions[currentQ];

  if (result) {
    const pct = test.questions.length > 0 ? Math.round((result.score / result.total) * 100) : 0;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-10 shadow-sm max-w-md w-full text-center">
          <div className="text-6xl mb-4">{pct >= 70 ? "🎉" : pct >= 40 ? "👍" : "📚"}</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Test Complete!</h2>
          <p className="text-4xl font-bold text-blue-600 mb-1">{result.score}/{result.total}</p>
          <p className="text-slate-500 mb-8">{pct}% score</p>
          <button onClick={() => router.push("/dashboard/student")}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{test.title}</h1>
            <p className="text-xs text-slate-500">Question {currentQ + 1} of {questions.length}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${timeLeft < 60 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
            <span className="text-xl">⏱️</span>
            <span className={`font-bold font-mono text-xl ${timeLeft < 60 ? "text-red-600" : "text-slate-900"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col">
        {q ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 shadow-sm flex-1">
            <h2 className="text-xl font-medium text-slate-900 leading-relaxed mb-8">
              {currentQ + 1}. {q.text}
            </h2>
            <div className="space-y-3">
              {[
                { key: "A", text: q.option_a },
                { key: "B", text: q.option_b },
                { key: "C", text: q.option_c },
                { key: "D", text: q.option_d },
              ].map((opt) => {
                const selected = answers[q.id] === opt.key;
                return (
                  <div key={opt.key} onClick={() => setAnswers({ ...answers, [q.id]: opt.key })}
                    className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                      selected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                    }`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selected ? "border-blue-500" : "border-slate-300"
                    }`}>
                      {selected && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                    </div>
                    <span className={`font-medium ${selected ? "text-blue-600" : "text-slate-700"}`}>
                      {opt.key}. {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">No questions in this test</div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <button disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}
            className="px-6 py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-30">
            Previous
          </button>
          <div className="flex gap-3">
            <button onClick={handleSubmit}
              className="px-6 py-3 text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors">
              Submit Test
            </button>
            {currentQ < questions.length - 1 && (
              <button onClick={() => setCurrentQ(currentQ + 1)}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
