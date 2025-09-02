"use client";
import { useState } from "react";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  
    return (
      <div className="relative">
        <button
          className="px-4 py-2 flex items-center gap-1 text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-gray-900 transition"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={open}
        >
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
                const { supabase } = await import("../../supabaseClient");
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
  