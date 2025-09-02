"use client";
import Image from "next/image";
import { useState } from "react";
import ProjectsCatalog from "./components/ProjectsCatalog";

function SettingsDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        onClick={() => setOpen((v) => !v)}
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
          <a
            href="#profile"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Profile
          </a>
          <a
            href="#account"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Account
          </a>
          <a
            href="#logout"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
}

function SideNavbar() {
  const [open, setOpen] = useState(true);

  const navItems = [
  { name: "Dashboard", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ), href: "#dashboard" },
  { name: "Network", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M6.757 17.243l-2.121 2.121m12.728 0l-2.121-2.121M6.757 6.757L4.636 4.636" />
      </svg>
    ), href: "#network" },
  { name: "Catalog", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 3v4M8 3v4" />
      </svg>
    ), href: "#catalog" },
  { name: "Search", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ), href: "#search" },
  { name: "Notification", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ), href: "#notification" },
  { name: "Home", icon: (
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
          Connectech
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

export default function catalog_home() {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black">
      {/* Side Navbar */}
      <SideNavbar />
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 ml-0 md:ml-56 transition-all duration-300"
        style={{ marginLeft: "var(--side-navbar-width, 14rem)" }}
      >
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Connectech logo"
            width={40}
            height={40}
            priority
            className="object-contain"
          />
          <span className="font-bold text-lg tracking-tight">Connectech</span>
        </div>
        <ul className="flex items-center gap-6 font-medium text-gray-700 dark:text-gray-200">
          <li>
            <a
              href="#dashboard"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#network"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Network
            </a>
          </li>
          <li>
            <a
              href="#catalog"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Catalog
            </a>
          </li>
          <li>
            <a
              href="#messages"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Messages
            </a>
          </li>
          <li>
            <SettingsDropdown />
          </li>
        </ul>
      </nav>
      {/* Main content placeholder */}
      <main className="flex flex-col items-center justify-center min-h-[70vh] py-16 ml-0 md:ml-56 transition-all duration-300"
        style={{ marginLeft: "var(--side-navbar-width, 14rem)" }}
      >
        <ProjectsCatalog />
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
