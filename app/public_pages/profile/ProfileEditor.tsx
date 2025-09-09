"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type UserProfile = {
  uuid: string;
  email: string;
  image_url?: string | null;
  name?: string | null;
};

export default function ProfileEditor() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("uuid, email, name, image_url")
        .eq("uuid", user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else if (data) {
        setProfile({
          uuid: data.uuid,
          email: data.email,
          name: data.name,
          image_url: data.image_url,
        });
        setName(data.name ?? "");
        setImageUrl(data.image_url ?? null);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Image upload + Supabase bucket logic
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    setError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      // Chemin: "uuid/12345_filename.png"
      const filePath = `${profile.uuid}/${timestamp}_${file.name}`;
  
      // Upload to bucket
      const { error: uploadError } = await supabase
        .storage
        .from('profile_picture')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
  
      // Get public URL
      const { data } = supabase
        .storage
        .from('profile_picture')
        .getPublicUrl(filePath);
      if (!data?.publicUrl) throw new Error('Could not get public URL.');
      setImageUrl(data.publicUrl);
  
      // Update user's image_url in DB
      const { error: updateError } = await supabase
        .from('users')
        .update({ image_url: data.publicUrl })
        .eq('uuid', profile.uuid);
      if (updateError) throw updateError;
  
      // Optionally update user metadata (auth)
      await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl },
      });
    } catch (err: any) {
      setError(
        typeof err === 'object' && err.message
          ? err.message
          : 'Error uploading image.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }
  

  // Save updated profile (name/image_url manual field)
  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setError(null);

    const updates = {
      uuid: profile.uuid,
      name,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };
    const { error: updateError } = await supabase.from("users").upsert(updates, {onConflict: "uuid"});
    if (updateError) {
      setError(updateError.message);
    } else {
      setProfile({ ...profile, name, image_url: imageUrl });
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F18585] via-[#CB90F1] to-[#EED5FB] flex flex-col justify-center">
      <div className="max-w-lg w-full mx-auto rounded-3xl bg-white/80 shadow-xl p-8 mt-16 mb-8">
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full bg-[#F49C9C] flex items-center justify-center overflow-hidden mb-3 shadow-lg border-4 border-[#F18585]">
            {imageUrl ? (
              <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <svg
                className="w-16 h-16 text-[#CB90F1]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx={12} cy={8} r={4} />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            )}
            {/* Petit bouton upload sur l'avatar : */}
            <button
              className="absolute bottom-2 right-2 bg-[#CB90F1] hover:bg-[#F18585] text-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-[#C174F2] transition"
              title="Change profile picture"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              type="button"
              style={{ zIndex: 10 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 16v-4m0 0V8m0 4h4m-4 0H8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={12} cy={12} r={8} />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
          <h1 className="text-3xl font-extrabold mb-1 text-[#C174F2] drop-shadow">Profile</h1>
          <p className="mb-4 text-[#F18585]">{profile?.email}</p>
        </div>

        {loading ? (
          <p className="text-center text-[#CB90F1]">Loading...</p>
        ) : !profile ? (
          <p className="text-center text-red-500">No profile found.</p>
        ) : (
          <>
            <label className="block mb-4">
              <span className="text-sm font-semibold mb-1 text-[#F49C9C]">Name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-none bg-[#E4BEF8] text-[#7A3192] focus:outline-none focus:ring-2 focus:ring-[#C174F2] transition"
              />
            </label>
            <label className="block mb-6">
              <span className="text-sm font-semibold mb-1 text-[#F49C9C]">Avatar URL</span>
              <input
                type="url"
                value={imageUrl || ""}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 rounded-lg border-none bg-[#F8CACF] text-[#90576E] focus:outline-none focus:ring-2 focus:ring-[#F18585] transition"
              />
            </label>

            {uploading && (
              <p className="text-center text-[#CB90F1] mb-2">Uploading image...</p>
            )}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="w-full py-3 rounded-full font-bold text-white transition 
                bg-gradient-to-r from-[#F49C9C] via-[#CB90F1] to-[#C174F2] 
                shadow-xl hover:from-[#F18585] hover:to-[#C174F2] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
