"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import AccountDropdown from "./AccountDropdown";
import { supabase } from "../../supabaseClient";

// --- Données de navigation déplacées en dehors du composant pour optimisation ---

type NavItem = { name: string; icon: ReactNode; href: string };

const navSections: { category: string; items: NavItem[] }[] = [
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
    ]
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
    ]
  },
  {
    category: "Public",
    items: [
      { 
        name: "Public Home", 
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
      { 
        name: "Pitch Deck", 
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 20h9" /><path d="M12 4h9" /><path d="M4 8h16" /><path d="M4 16h16" /><path d="M4 12h16" />
          </svg>
        ), 
        href: "/public_pages/pitch-deck" 
      },
      {
        name: "Messages",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
        href: "/public_pages/messages"
      },
      // Note: Le lien "Login" est géré dynamiquement ci-dessous et a été retiré de cette liste statique.
    ]
  },
];

const navItems: NavItem[] = navSections.flatMap(section => section.items);

export default function SideNavbar() {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function getUser() {
      // Pas besoin de setLoading(true) ici, l'état initial est déjà true
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted) {
        setUser(user);
        setLoading(false);
      }
    }
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // La vérification isMounted n'est pas nécessaire ici car le listener sera nettoyé
      setUser(session?.user ?? null);
    });

    // --- CORRECTION: Ajout de la fonction de nettoyage pour éviter les fuites de mémoire ---
    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []); // Le tableau de dépendances vide est correct

  return (
    <aside className={`fixed inset-y-0 left-0 z-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${open ? "w-56" : "w-16"}`}>
      <div className="flex items-center justify-end px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <button
          className="ml-auto p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? "Hide sidebar" : "Show sidebar"}
        >
          <svg className={`w-6 h-6 transition-transform ${open ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M19 12H5" />
            <path d="M12 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      <nav className="mt-4">
        <ul className="flex flex-col gap-2">
          {/* --- CORRECTION: Logique d'affichage pour le login/compte --- */}
          <li key="login-or-account">
            {loading ? (
              // État de chargement
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-500 dark:text-gray-400 ${open ? "" : "justify-center"}`}>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <span className={`transition-all duration-200 ${open ? "opacity-100 ml-2" : "opacity-0 w-0"}`}>
                  Loading...
                </span>
              </div>
            ) : user ? (
              // État connecté (toujours visible, même si fermé)
              <div className={`flex items-center ${open ? "" : "justify-center"}`}>
                <AccountDropdown userId={user.id} />
              </div>
            ) : (
              // État déconnecté
              <a href="/public_pages/login" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${open ? "" : "justify-center"}`} title="Login">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1" />
                </svg>
                <span className={`transition-all duration-200 ${open ? "opacity-100 ml-2" : "opacity-0 w-0 ml-0 pointer-events-none"}`}>Login</span>
              </a>
            )}
          </li>

          {navItems.map(item => (
            <li key={item.name}>
              <a href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${open ? "" : "justify-center"}`} title={item.name}>
                {item.icon}
                <span className={`transition-all duration-200 ${open ? "opacity-100 ml-2" : "opacity-0 w-0 ml-0 pointer-events-none"}`}>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
