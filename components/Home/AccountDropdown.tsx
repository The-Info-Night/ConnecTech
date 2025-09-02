"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfilePic() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("avatar_url")
          .eq("id", user.id)
          .single();
        if (!error && data && data.avatar_url && isMounted) {
          setAvatarUrl(data.avatar_url);
        } else if (isMounted) {
          setAvatarUrl(user.user_metadata?.avatar_url ?? null);
        }
      }
    }
    fetchProfilePic();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="relative">
      <button
        className="px-4 py-2 flex items-center gap-2 text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-gray-900 transition"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover border border-gray-300 dark:border-gray-700"
          />
        ) : (
          <span className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm font-bold">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </span>
        )}
        Account
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
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
          <a
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-gray-900"
          >
            Profile
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-gray-900"
          >
            Settings
          </a>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-gray-900"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}