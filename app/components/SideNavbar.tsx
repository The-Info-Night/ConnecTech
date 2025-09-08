"use client";

import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import AccountDropdown from "./AccountDropdown";
import { supabase } from "../../supabaseClient";

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
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        ),
        href: "/admin_pages/dashboard"
      },
      {
        name: "Admin Home",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 12l9-9 9 9" />
            <path d="M9 21V9h6v12" />
          </svg>
        ),
        href: "/admin_pages/home"
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
        href: "/admin_pages/pitch-deck"
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
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        ),
        href: "/startup_pages/dashboard"
      },
      {
        name: "Messages",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
        href: "/startup_pages/messaging"
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
        href: "/"
      },
      {
        name: "Catalog",
        icon: (
          <Image
            src="/catalog.svg"
            alt="Catalog Icon"
            width={24}
            height={24}
          />
        ),
        href: "/public_pages/catalog"
      },
      { name: "Events",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
          </svg>
        ),
        href: "/public_pages/events"
      },
      {
        name: "News",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M4 6h16M4 10h16M4 14h10M4 18h10" />
          </svg>
        ),
        href: "/public_pages/news"
      }
    ]
  },
];

export default function SideNavbar() {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function getUserAndRole() {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) { if (isMounted) { setUser(null); setUserRole(null); } setLoading(false); return; }
      if (isMounted) setUser(user);

      if (user?.id) {
        const { data, error: roleError } = await supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .maybeSingle();
        if (!roleError && isMounted) setUserRole(data?.role || null);
      } else {
        if (isMounted) setUserRole(null);
      }
      if (isMounted) setLoading(false);
    }

    getUserAndRole();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        supabase
          .from("users")
          .select("role")
          .eq("email", session.user.email)
          .maybeSingle()
          .then(({ data, error }) => {
            if (!error) setUserRole(data?.role || null);
            else setUserRole(null);
          });
      } else {
        setUserRole(null);
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const filteredNavSections = NAV_SECTIONS.map((section) => {
    if (section.category === "Admin" && userRole !== "admin") return { ...section, items: [] };
    if (section.category === "Startup" && userRole !== "founder") return { ...section, items: [] };
    return section;
  });

  const navItems: NavItem[] = filteredNavSections.flatMap((section) => section.items);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        open ? "w-56" : "w-16"
      }`}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-end px-4 py-4 border-b border-gray-200 dark:border-gray-800">
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
          <li key="login-or-account">
            {loading ? (
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 transition ${
                  open ? "" : "justify-center"
                }`}
              >
                <span className="relative w-6 h-6 flex items-center justify-center">
                  <svg className="w-6 h-6 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="url(#loading-gradient)" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </div>
            ) : user ? (
              <div className={`flex items-center ${open ? "" : "justify-center"}`}>
                <AccountDropdown
                  userId={user.id}
                  sidebarOpen={open}
                  onOpenSidebar={() => setOpen(true)}
                />
              </div>
            ) : (
              <a
                href="/public_pages/login"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  open ? "" : "justify-center"
                }`}
                title="Login"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
                {open && <span className="transition-all duration-200 ml-2">Login</span>}
              </a>
            )}
          </li>

          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  open ? "" : "justify-center"
                }`}
                title={item.name}
              >
                {item.icon}
                {open && <span className="transition-all duration-200 ml-2">{item.name}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}