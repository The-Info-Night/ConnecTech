"use client";

import { useEffect, useState } from "react";
import SideNavbar from "../../components/SideNavbar";
import { supabase } from "../../../lib/supabaseClient";

type UserProfile = {
  id: string;
  email: string;
  image_url?: string;
  name?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, image_url")
        .eq("email", user.email)
        .maybeSingle();

      if (!error) setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <SideNavbar />
      <main className="flex-1 overflow-auto px-4 py-8">
        <header className="max-w-2xl mx-auto mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-center lg:text-left">Profile</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1 max-w-md text-center lg:text-left">
            View your account information.
          </p>
        </header>
        <section className="max-w-2xl mx-auto bg-white dark:bg-neutral-800 rounded-xl shadow p-6">
          {loading ? (
            <div className="text-center text-neutral-500 dark:text-neutral-400">Loading...</div>
          ) : profile ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                {profile.image_url ? (
                  <img
                    src={profile.image_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {profile.name || "No name provided"}
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400">{profile.email}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">No profile found.</div>
          )}
        </section>
      </main>
    </div>
  );
}
