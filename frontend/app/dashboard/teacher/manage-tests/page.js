"use client";
import { useState, useEffect } from "react";
import { testService } from "@/services/api";
import { FiPlus, FiTrash2, FiSave, FiClock, FiBookOpen } from "react-icons/fi";
import Loader from "@/components/Loader";

export default function ManageTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  // New Test State
  const [newTest, setNewTest] = useState({
    title: "",
    subject: "physics",
    class_level: "12",
    duration_minutes: 60,
  });
  
  // Questions State
  const [activeTestId, setActiveTestId] = useState(null);
  const [questions, setQuestions] = useState([
    { text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "A" }
  ]);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    try {
      const { data } = await testService.getAll();
      setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      const { data } = await testService.create(newTest);
      setTests([data, ...tests]);
      setActiveTestId(data.id);
      setShowCreate(false);
    } catch (err) {
      alert("Failed to create test");
    }
  };

  const addQuestionField = () => {
    setQuestions([...questions, { text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "A" }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const removeQuestionField = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveQuestions = async () => {
    if (!activeTestId) return;
    try {
      await testService.addQuestions(activeTestId, questions);
      alert("Questions saved successfully!");
      setActiveTestId(null);
      setQuestions([{ text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "A" }]);
      loadTests();
    } catch (err) {
      alert("Failed to save questions");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Mock Tests</h1>
        {!activeTestId && (
          <button 
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlus /> {showCreate ? "Cancel" : "Create New Test"}
          </button>
        )}
      </div>

      {/* Create Test Form */}
      {showCreate && !activeTestId && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Test Details</h2>
          <form onSubmit={handleCreateTest} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Test Title</label>
              <input type="text" required value={newTest.title} onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" placeholder="e.g. Physics Chapter 1 Mock" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <select value={newTest.subject} onChange={(e) => setNewTest({...newTest, subject: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm">
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="mathematics">Mathematics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Mins)</label>
              <input type="number" required value={newTest.duration_minutes} onChange={(e) => setNewTest({...newTest, duration_minutes: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Continue to Questions
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Question Editor */}
      {activeTestId && (
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold">Add Questions</h2>
            <p className="text-blue-100 text-sm">Add multiple choice questions to your new test.</p>
          </div>

          {questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm relative">
              <button onClick={() => removeQuestionField(idx)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors">
                <FiTrash2 />
              </button>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Question {idx + 1}</label>
                <textarea rows={2} value={q.text} onChange={(e) => updateQuestion(idx, "text", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" placeholder="The question text..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((opt) => (
                  <div key={opt}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Option {opt.toUpperCase()}</label>
                    <input type="text" value={q[`option_${opt}`]} onChange={(e) => updateQuestion(idx, `option_${opt}`, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder={`Answer ${opt.toUpperCase()}...`} />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Correct Answer</label>
                <div className="flex gap-4">
                  {["A", "B", "C", "D"].map((val) => (
                    <button key={val} onClick={() => updateQuestion(idx, "correct_option", val)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                        q.correct_option === val ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}>
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 pt-6 sticky bottom-6 z-10 bg-slate-50/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl">
            <button onClick={addQuestionField}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-300 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
              <FiPlus /> Add Another Question
            </button>
            <button onClick={handleSaveQuestions}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
              <FiSave className="text-lg" /> Publish Test ({questions.length} Questions)
            </button>
          </div>
        </div>
      )}

      {/* Existing Tests List */}
      {!activeTestId && !showCreate && (
        <div className="grid grid-cols-1 gap-4">
          {tests.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
                  <FiBookOpen />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{t.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><FiClock /> {t.duration_minutes} mins</span>
                    <span>•</span>
                    <span className="capitalize">{t.subject}</span>
                    <span>•</span>
                    <span>{t.question_count || 0} Questions</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {tests.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-bold text-slate-900">No tests yet</h3>
              <p className="text-slate-500">Click create to start building your first mock test.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
