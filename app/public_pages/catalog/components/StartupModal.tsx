"use client";
import { useEffect } from "react";

type Startup = {
  id: number;
  name: string;
  description?: string | null;
  sector?: string | null;
  needs?: string | null;
  project_status?: string | null;
  website_url?: string | null;
  legal_status?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  social_media_url?: string | null;
  maturity?: string | null;
  founders?: string[] | null;
};

interface StartupModalProps {
  startup: Startup | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StartupModal({ startup, isOpen, onClose }: StartupModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !startup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="
        relative max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto
        rounded-2xl shadow-2xl
        bg-gradient-to-b from-[#EED5FB] via-[#F6AEAE] to-[#CB90F1] border-2 border-[#C174F2]
        flex flex-col
      ">
        <div className="flex items-center justify-between p-6 border-b border-[#CB90F1]/50">
          <h2 className="text-2xl font-extrabold text-[#7A3192]">
            {startup.name}
          </h2>
          <button
            onClick={onClose}
            className="text-[#CB90F1] hover:text-[#F18585] text-3xl transition font-bold rounded-full px-2 py-1"
            aria-label="Close"
            tabIndex={0}
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6 flex flex-col items-center w-full">
          {startup.description && (
            <div className="w-full bg-white/60 border border-[#EED5FB] rounded-xl px-5 py-4">
              <h3 className="text-lg font-bold text-[#C174F2] mb-1">
                Description
              </h3>
              <p className="text-[#7A3192]">{startup.description}</p>
            </div>
          )}

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {startup.sector && (
              <div className="bg-[#E4BEF8]/60 rounded-xl px-4 py-3">
                <h4 className="font-semibold text-[#CB90F1]">Sector</h4>
                <p className="text-[#7A3192]">{startup.sector}</p>
              </div>
            )}
            {startup.project_status && (
              <div className="bg-[#F6AEAE]/50 rounded-xl px-4 py-3">
                <h4 className="font-semibold text-[#F18585]">Status</h4>
                <p className="text-[#7A3192]">{startup.project_status}</p>
              </div>
            )}
            {startup.maturity && (
              <div className="bg-[#CB90F1]/20 rounded-xl px-4 py-3">
                <h4 className="font-semibold text-[#CB90F1]">Maturity</h4>
                <p className="text-[#7A3192]">{startup.maturity}</p>
              </div>
            )}
            {startup.legal_status && (
              <div className="bg-[#F8CACF]/40 rounded-xl px-4 py-3">
                <h4 className="font-semibold text-[#F49C9C]">Legal Status</h4>
                <p className="text-[#7A3192]">{startup.legal_status}</p>
              </div>
            )}
          </div>

          {(startup.email || startup.phone || startup.address) && (
            <div className="w-full bg-[#D5A8F2]/30 rounded-xl px-5 py-4">
              <h3 className="text-lg font-semibold text-[#CB90F1] mb-2">Contact</h3>
              <div className="space-y-1 text-[#7A3192]">
                {startup.email && <p><span className="font-bold">Email:</span> {startup.email}</p>}
                {startup.phone && <p><span className="font-bold">Phone:</span> {startup.phone}</p>}
                {startup.address && <p><span className="font-bold">Address:</span> {startup.address}</p>}
              </div>
            </div>
          )}

          {startup.needs && (
            <div className="w-full bg-[#F18585]/20 rounded-xl px-5 py-4">
              <h3 className="text-lg font-semibold text-[#F18585] mb-2">Needs</h3>
              <p className="text-[#7A3192]">{startup.needs}</p>
            </div>
          )}

          {startup.founders && startup.founders.length > 0 && (
            <div className="w-full bg-[#CB90F1]/15 rounded-xl px-5 py-4">
              <h3 className="text-lg font-semibold text-[#C174F2] mb-2">Founders</h3>
              <ul className="list-disc list-inside text-[#7A3192]">
                {startup.founders.map((founder, index) => (
                  <li key={index}>{founder}</li>
                ))}
              </ul>
            </div>
          )}

          {(startup.website_url || startup.social_media_url) && (
            <div className="w-full bg-[#E4BEF8]/40 rounded-xl px-5 py-4">
              <h3 className="text-lg font-semibold text-[#CB90F1] mb-2">Links</h3>
              <div className="space-y-1">
                {startup.website_url && (
                  <a
                    href={startup.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#7A3192] font-semibold underline hover:text-[#CB90F1] transition"
                  >
                    Website
                  </a>
                )}
                {startup.social_media_url && (
                  <a
                    href={startup.social_media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#7A3192] font-semibold underline hover:text-[#F49C9C] transition"
                  >
                    Social media
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
