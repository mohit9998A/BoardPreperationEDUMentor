"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBook, FiFileText, FiUpload, FiLogOut, FiClipboard } from "react-icons/fi";

const studentLinks = [
  { href: "/dashboard/student", label: "Dashboard", icon: FiHome },
  { href: "/materials", label: "Study Materials", icon: FiBook },
  { href: "/tests", label: "Mock Tests", icon: FiClipboard },
];

const teacherLinks = [
  { href: "/dashboard/teacher", label: "Dashboard", icon: FiHome },
  { href: "/dashboard/teacher/upload", label: "Upload Material", icon: FiUpload },
  { href: "/dashboard/teacher/manage-tests", label: "Manage Tests", icon: FiFileText },
];

export default function Sidebar({ role = "student" }) {
  const pathname = usePathname();
  const links = role === "teacher" ? teacherLinks : studentLinks;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-100">
        <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <span className="text-2xl">📚</span> BoardPrep
        </Link>
        {role === "teacher" && (
          <span className="text-[10px] font-bold text-emerald-600 mt-1 block tracking-wider uppercase">
            Teacher Portal
          </span>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
