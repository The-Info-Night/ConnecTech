"use client";

import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import AccountDropdown from "./AccountDropdown";
import { supabase } from "../../supabaseClient";
import { useUserRole } from "../hooks/userRoleContext";

type NavItem = {
  name: string;
  icon: ReactNode;
  href: string;
};

const NAV_SECTIONS: { category: string; items: NavItem[] }[] = [
  {
    category: "Admin",
    items: [
      {
        name: "Admin Dashboard",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8v-6h-8z" />
          </svg>
        ),
        href: "/admin_pages/dashboard",
      },
      {
        name: "Admin Home",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 12l9-9 9 9" />
            <path d="M9 21V9h6v12" />
          </svg>
        ),
        href: "/admin_pages/home",
      },
      {
        name: "Pitch Deck",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 20h9" />
            <path d="M12 4h9" />
            <path d="M4 8h16" />
            <path d="M4 16h16" />
            <path d="M4 12h16" />
          </svg>
        ),
        href: "/admin_pages/pitch-deck",
      },
    ],
  },
  {
    category: "Startup",
    items: [
      {
        name: "Startup Dashboard",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8v-6h-8z" />
          </svg>
        ),
        href: "/startup_pages/dashboard",
      },
      {
        name: "Messages",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
        href: "/startup_pages/messaging",
      },
    ],
  },
  {
    category: "Public",
    items: [
      {
        name: "Home",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 12l9-9 9 9" />
            <path d="M9 21V9h6v12" />
          </svg>
        ),
        href: "/",
      },
      {
        name: "Catalog",
        icon: (
          <Image src="/catalog.svg" alt="Catalog Icon" width={24} height={24} />
        ),
        href: "/public_pages/catalog",
      },
      {
        name: "Events",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12" />
          </svg>
        ),
        href: "/public_pages/events",
      },
      {
        name: "News",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
        href: "/public_pages/news",
      },
    ],
  },
];

const INVESTOR_MESSAGES_ITEM: NavItem = {
  name: "Messages",
  icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  href: "/startup_pages/messaging",
};

export default function SideNavbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { userRole, loading } = useUserRole();
  const [localLoading, setLocalLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    function checkDesktop() {
      if (typeof window !== "undefined") {
        setIsDesktop(window.innerWidth >= 1024);
      }
    }
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function getUserAndRole() {
      setLocalLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && isMounted) setUser(user ?? null);
      setLocalLoading(false);
    }
    getUserAndRole();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      if (isMounted) getUserAndRole();
    });
    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    }
  }, []);

  const filteredSections = NAV_SECTIONS.map(section => {
    if (section.category === "Admin" && userRole !== "admin") return {...section, items: []};
    if (section.category === "Startup" && userRole !== "founder") return {...section, items: []};
    return section;
  });

  let navItems = filteredSections.flatMap(section => section.items);
  if (userRole === "investor") {
    if (!navItems.find(item => item.name === "Messages")) {
      navItems = [INVESTOR_MESSAGES_ITEM, ...navItems];
    }
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        )}
      </button>
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 border-r border-gray-800 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:w-20 xl:w-56`}
      >
        <div className="hidden lg:flex items-center justify-end px-4 py-4 border-b border-gray-700">
          <button
            className="p-1 rounded hover:bg-gray-700"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg className={`w-6 h-6 transition-transform ${open ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M19 12H5" />
              <path d="M12 5l-7 7 7 7" />
            </svg>
          </button>
        </div>
        <nav className="mt-4 overflow-y-auto h-[calc(100vh-56px)]">
          <ul className="flex flex-col gap-2 px-1">
            <li className="h-8" />
            <li>
              {localLoading || loading ? (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white transition ${open ? "" : "justify-center"}`}>
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {open && <span className="ml-2">Loading...</span>}
                </div>
              ) : user ? (
                <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${open ? "justify-start" : "justify-center"}`}>
                  <AccountDropdown userId={user.id} />
                  {open && <span className="ml-2 text-white">{user.email ?? user.id}</span>}
                </div>
              ) : (
                <a href="/public_pages/login" 
                   className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-gray-700 transition ${open ? "justify-start" : "justify-center"}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 12h16" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {open && <span>Login</span>}
                </a>
              )}
            </li>
            {navItems.map(item => (
              <li key={item.name}>
                <a 
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-gray-700 transition ${open ? "justify-start" : "justify-center"}`} 
                  title={item.name}
                >
                  {item.icon}
                  {open && <span>{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
