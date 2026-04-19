import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
            Master Your CBSE Exams with{" "}
            <span className="text-blue-600">Confidence</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed">
            The ultimate preparation platform for Class 10 & 12 students.
            Practice mock tests, access premium study materials, and track your
            progress in real-time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-blue-700 transition-all"
            >
              Get Started for Free
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-colors"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-slate-500 text-lg">
              Built specifically for CBSE curriculum and board exam patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "📖", bg: "bg-blue-50", title: "Study Materials",
                text: "Access curated notes, previous year papers, and sample papers organized by chapter and subject."
              },
              {
                emoji: "⏱️", bg: "bg-green-50", title: "Mock Tests",
                text: "Practice in a real exam environment with countdown timers and automated scoring."
              },
              {
                emoji: "📈", bg: "bg-amber-50", title: "Progress Tracking",
                text: "Visualize your performance over time with analytics to identify weak areas."
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-6`}>
                  {f.emoji}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
