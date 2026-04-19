"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { FiUser, FiMail, FiShield, FiCalendar } from "react-icons/fi";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">My Profile</h1>
        
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg shadow-blue-200">
              {user.first_name?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.first_name} {user.last_name}</h2>
              <p className="text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                <FiMail />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-slate-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                <FiShield />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</p>
                <p className="text-slate-900 font-medium">{user.username || user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                <FiCalendar />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</p>
                <p className="text-slate-900 font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
