"use client";
import { useState } from "react";

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Settings
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
          <a href="#profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition">Profile</a>
          <a href="#account" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition">Account</a>
          <a href="#logout" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition">Logout</a>
        </div>
      )}
    </div>
  );
}
