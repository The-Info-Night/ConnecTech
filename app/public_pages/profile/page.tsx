"use client";

import SideNavbar from "../../components/SideNavbar";
import ProfileEditor from "./ProfileEditor";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 flex">
      <SideNavbar />
      <main className="flex-1 overflow-auto px-4 py-8">
        <ProfileEditor />
      </main>
    </div>
  );
}
