"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

type UserProfile = { id: string; email: string; avatar_url?: string; full_name?: string; };

export default function AccountDropdown({ userId }: { userId: string }) {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {/* Avatar for later */}
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full" />
        ) : (
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
        )}
        <span>Account</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full w-full mt-1 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-10">
          <button
            onClick={() => router.push("/profile")}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <span>Profile</span>
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-red-500"
          >
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}


