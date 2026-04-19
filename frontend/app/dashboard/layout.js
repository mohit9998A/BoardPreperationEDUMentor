"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiHome, FiBook, FiFileText, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const isTeacher = user?.role === "teacher";
  
  const navItems = [
    { name: "Overview", href: isTeacher ? "/dashboard/teacher" : "/dashboard/student", icon: <FiHome /> },
    { name: "My Materials", href: isTeacher ? "/dashboard/teacher/upload" : "/materials", icon: <FiBook /> },
    { name: "Tests", href: isTeacher ? "/dashboard/teacher/manage-tests" : "/tests", icon: <FiFileText /> },
    { name: "Profile", href: "/profile", icon: <FiUser /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-40">
        <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <span className="text-2xl">📚</span> BoardPrep
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="h-full flex flex-col p-4">
            <div className="hidden lg:flex items-center gap-2 px-2 py-4 mb-6">
              <span className="text-3xl">📚</span>
              <span className="font-bold text-xl text-slate-900">BoardPrep</span>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <div className="px-4 py-4 mb-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
