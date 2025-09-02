import Image from "next/image";
import SettingsDropdown from "./SettingsDropdown";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";
import AccountDropdown from "./AccountDropdown";

export default function TopNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data?.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <nav
      className="flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 bg-white dark:bg-black z-30"
      style={{ height: "64px" }}
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
          <a href="#dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#network" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Network
          </a>
        </li>
        <li>
          <a href="#projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Projects
          </a>
        </li>
        <li>
          <a href="#messages" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Messages
          </a>
        </li>
        <li>
          <SettingsDropdown />
        </li>
        <li className="ml-4 relative">
        {!isAuthenticated ? (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        ) : (
          <AccountDropdown />
        )}
      </li>
      </ul>
    </nav>
  );
}
