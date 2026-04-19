"use client";
import Sidebar from "@/components/Sidebar";

export default function StudentLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar role="student" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
