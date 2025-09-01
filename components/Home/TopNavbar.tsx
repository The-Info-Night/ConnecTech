import Image from "next/image";
import SettingsDropdown from "./SettingsDropdown";

export default function TopNavbar() {
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
      </ul>
    </nav>
  );
}
