"use client";
import { useState } from "react";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  
    return (
      <div className="relative">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition"
          onClick={() => setOpen((prev) => !prev)}
        >
          Account
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50">
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
            <a
              href="/logout"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-gray-900"
            >
              Logout
            </a>
          </div>
        )}
      </div>
    );
  }
  