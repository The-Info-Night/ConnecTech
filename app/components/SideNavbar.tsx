"use client";
import { useState } from "react";

export default function SideNavbar() {
  const [open, setOpen] = useState(true);

  const navItems = [
    { name: "Admin Dashboard", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ), href: "/admin_pages/dashboard" },
    { name: "Admin Home", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V9h6v12" />
      </svg>
    ), href: "/admin_pages/home" },
    { name: "Public Home", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V9h6v12" />
      </svg>
    ), href: "/" },
    { name: "Catalog", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V9h6v12" />
      </svg>
    ), href: "/public_pages/catalog" },
    { name: "Pitch Deck", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 20h9" />
        <path d="M12 4h9" />
        <path d="M4 8h16" />
        <path d="M4 16h16" />
        <path d="M4 12h16" />
      </svg>
    ), href: "/public_pages/pitch-deck" },
    { name: "Login", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V9h6v12" />
      </svg>
    ), href: "/public_pages/login" },
    { name: "Messages", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ), href: "/messages" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300
        ${open ? "w-56" : "w-16"}`}
    >
      <div className="flex items-center justify-end px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <button
          className="ml-auto p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? "Hide sidebar" : "Show sidebar"}
        >
          <svg
            className={`w-6 h-6 transition-transform ${open ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5" />
            <path d="M12 5l-7 7 7 7" />
          </svg>
        </button>
      </div>
      <nav className="mt-4">
        <ul className="flex flex-col gap-2">
          {navItems.map(item => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition
                  ${open ? "" : "justify-center"}`}
                title={item.name}
              >
                {item.icon}
                <span className={`transition-all duration-200 ${open ? "opacity-100 ml-2" : "opacity-0 w-0 ml-0 pointer-events-none"}`}>
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}