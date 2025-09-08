"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

type UserProfile = { id: string; email: string; avatar_url?: string; full_name?: string; };

export default function AccountDropdown({ userId, sidebarOpen, onOpenSidebar }: { userId: string, sidebarOpen: boolean, onOpenSidebar: () => void }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  // Commented avatar fetching for later
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const { data, error } = await supabase
  //       .from<UserProfile>("users")
  //       .select("*")
  //       .eq("id", userId)
  //       .single();
  //
  //     if (!error) setProfile(data);
  //     else console.error("Erreur fetch profile:", error.message);
  //   };
  //   fetchProfile();
  // }, [userId]);

  const handleClick = () => {
    if (!sidebarOpen) onOpenSidebar();
    setOpen((v) => !v);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="relative w-full">
      <button
        onClick={handleClick}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
        </svg>
        {sidebarOpen && <span className="transition-all duration-200 ml-2">Account</span>}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && sidebarOpen && (
        <div className="absolute left-0 top-full w-full mt-1 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-10">
          <button
            onClick={() => router.push("/profile")}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex cursor-pointer items-center gap-2"
          >
            <span>Profile</span>
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
          >
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-red-500 cursor-pointer"
          >
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
