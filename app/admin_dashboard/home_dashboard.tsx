"use client";
import Image from "next/image";
import { useState } from "react";

function SideNavbar() {
  const [open, setOpen] = useState(true);

  const navItems = [
    { name: "Admin Dashboard", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ), href: "/admin_dashboard#admin_dashboard" },
    { name: "Admin Home", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V9h6v12" />
      </svg>
    ), href: "/admin_dashboard/home" },
    { name: "Public Home", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V9h6v12" />
      </svg>
    ), href: "/" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300
        ${open ? "w-56" : "w-16"}
      `}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <span className={`font-bold text-lg tracking-tight transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          Connectech : Admin Home
        </span>
        <button
          className="ml-auto p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setOpen((v) => !v)}
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
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition
                  ${open ? "" : "justify-center"}
                `}
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

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black">
      {/* Side Navbar */}
      <SideNavbar />
      {/* Main content placeholder */}
      <main className="flex flex-col items-center justify-center min-h-[70vh] py-16 ml-0 md:ml-56 transition-all duration-300"
        style={{ marginLeft: "var(--side-navbar-width, 14rem)" }}
      >
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Welcome to Connectech Admin Home Page!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Select a section from the navigation bar to get started.
        </p>
      </main>
      <style jsx global>{`
        @media (min-width: 768px) {
          :root {
            --side-navbar-width: 14rem;
          }
        }
        @media (max-width: 767px) {
          :root {
            --side-navbar-width: 4rem;
          }
        }
      `}</style>
    </div>
  );
}
