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
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
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
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M12 7v14" />
            <path d="M16 12h2" />
            <path d="M16 8h2" />
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            <path d="M6 12h2" />
            <path d="M6 8h2" />
          </svg>
        ),
        href: "/public_pages/catalog",
      },
      {
        name: "Events",
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
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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

  let navItems: NavItem[] = filteredNavSections.flatMap((section) => section.items);
  if (userRole === "investor") {
    const alreadyPresent = navItems.some((item) => item.href === INVESTOR_MESSAGES_ITEM.href);
    if (!alreadyPresent) navItems = [INVESTOR_MESSAGES_ITEM, ...navItems];
  }

  return (
    <>
      {/* Burger mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white/90 text-[#F18585] shadow"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-[#eed5fb]/70 z-10 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-20 
          bg-gradient-to-b from-[#F18585] via-[#CB90F1] to-[#EED5FB]
          border-r border-[#CB90F1]/25 shadow-lg
          transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} w-56
          lg:translate-x-0 lg:${open ? "w-56" : "w-20"} lg:w-auto
        `}
        style={{
          ...(isDesktop
            ? {
                width: open ? "14rem" : "5rem",
                minWidth: open ? "14rem" : "5rem",
                maxWidth: open ? "14rem" : "5rem",
                transition: "all 0.3s",
                transform: "translateX(0)",
              }
            : {}),
          borderRight: "1px solid rgba(238, 213, 251, 0.56)", // Ajout d'un contour noir à droite, 50% opacity
        }}
      >
        {/* Collapse button desktop */}
        <div className="hidden lg:flex items-center justify-end px-4 py-4 border-b border-[#EED5FB]/50">
          <button
            className="ml-auto p-1 rounded hover:bg-[#EED5FB]/60"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Hide sidebar" : "Show sidebar"}
          >
            <svg
              className={`w-6 h-6 transition-transform ${open ? "" : "rotate-180"}`}
              fill="none"
              stroke="#CB90F1"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5" />
              <path d="M12 5l-7 7 7 7" />
            </svg>
          </button>
        </div>

        <nav className="pt-6">
          <ul className="flex flex-col gap-2">

            {/* Compte ou login */}
            <li key="login-or-account">
              {(localLoading || loading) ? (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#F49C9C] transition ${open ? "" : "justify-center"}`}>
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="#F49C9C" strokeWidth={2} viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#F49C9C" strokeWidth="4" />
                  </svg>
                  {open && <span className="ml-2">Chargement...</span>}
                </div>
              ) : user ? (
                <div className={`flex items-center ${open ? "pl-2" : "justify-center"}`}>
                  <AccountDropdown userId={user.id} sidebarOpen={open} onOpenSidebar={() => setOpen(true)} />
                </div>
              ) : (
                <a
                  href="/public_pages/login"
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#F18585] 
                    hover:bg-[#EED5FB] hover:text-[#7A3192]
                    transition ${open ? "justify-start" : "justify-center"}
                  `}
                  title="Login"
                >
                  <svg className="w-6 h-6" fill="none" stroke="#F18585" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                  {open && <span className="ml-2">Login</span>}
                </a>
              )}
            </li>
            {/* Liens */}
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-bold 
                    text-[#7A3192] hover:bg-white/80 hover:text-[#F18585]
                    active:bg-[#E4BEF8] active:text-[#C174F2] transition
                    shadow-sm ${open ? "justify-start" : "justify-center"}
                  `}
                  title={item.name}
                >
                  {item.icon}
                  {open && <span className="ml-2">{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}