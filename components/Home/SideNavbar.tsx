"use client";
import { useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
    href: "#dashboard",
  },
  {
    name: "Network",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M6.757 17.243l-2.121 2.121m12.728 0l-2.121-2.121M6.757 6.757L4.636 4.636" />
      </svg>
    ),
    href: "#network",
  },
  {
    name: "Projects",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 3v4M8 3v4" />
      </svg>
    ),
    href: "#projects",
  },
  {
    name: "Search",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    href: "#search",
  },
  {
    name: "Notification",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
    href: "#notification",
  },
  {
    name: "Home",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V9h6v12" />
      </svg>
    ),
    href: "#home",
  },
];

export default function SideNavbar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`fixed left-0 z-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300
        ${open ? "w-56" : "w-16"}`}
      style={{
        top: "64px", 
        height: "calc(100vh - 64px)",
      }}
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
