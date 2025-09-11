"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

type UserProfile = { id: string; email: string; image_url?: string; full_name?: string; };

export default function AccountDropdown({
  userId,
  sidebarOpen,
  onOpenSidebar,
}: {
  userId: string;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;
      const { data, error } = await supabase
        .from("users")
        .select("image_url")
        .eq("uuid", userId)
        .maybeSingle();
  if (!error && data) setProfile({ id: userId, email: "", ...data });
    }
    fetchProfile();
  }, [userId]);
  const router = useRouter();

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
        className={`
          flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold
          border border-[#CB90F1] shadow-sm
          text-[#7A3192] bg-transparent 
          hover:bg-[#F8CACF]/80 hover:text-[#F18585]
          focus:ring-2 focus:ring-[#CB90F1]/40
          active:bg-white/80 active:text-[#F18585]
          transition
        `}
        style={{
          boxShadow: "0 1px 4px 0 #cb90f122",
        }}
      >
        {profile?.image_url ? (
          <img
            src={profile.image_url}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover border border-[#CB90F1]"
          />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="#7A3192" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
          </svg>
        )}
        {sidebarOpen && (
          <span className="transition-all duration-200 ml-2">Account</span>
        )}
        <svg
          className={`w-4 h-4 text-[#7A3192] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="#7A3192"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && sidebarOpen && (
        <div
          className="
            absolute left-0 top-full w-full mt-2 rounded-2xl shadow-2xl
            bg-white border border-[#CB90F1]/40 z-10 p-1
          "
        >
          <button
            onClick={() => router.push("/public_pages/profile")}
            className="
              w-full text-left px-4 py-2 rounded-lg
              font-semibold flex gap-2 items-center
              text-[#7A3192] hover:bg-[#EED5FB] hover:text-[#C174F2]
              transition
            "
          >
            <span>Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="
              w-full text-left px-4 py-2 rounded-lg
              font-bold flex gap-2 items-center
              text-[#F18585] hover:bg-[#F8CACF]/90 hover:text-[#F18585]
              transition
            "
          >
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}