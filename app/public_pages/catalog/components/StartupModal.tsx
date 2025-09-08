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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {startup.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {startup.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {startup.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {startup.sector && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Sector</h4>
                <p className="text-gray-600 dark:text-gray-400">{startup.sector}</p>
              </div>
            )}

            {startup.project_status && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Status</h4>
                <p className="text-gray-600 dark:text-gray-400">{startup.project_status}</p>
              </div>
            )}

            {startup.maturity && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Maturity</h4>
                <p className="text-gray-600 dark:text-gray-400">{startup.maturity}</p>
              </div>
            )}

            {startup.legal_status && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Legal status</h4>
                <p className="text-gray-600 dark:text-gray-400">{startup.legal_status}</p>
              </div>
            )}
          </div>

          {(startup.email || startup.phone || startup.address) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Contact
              </h3>
              <div className="space-y-2">
                {startup.email && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span> {startup.email}
                  </p>
                )}
                {startup.phone && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Phone:</span> {startup.phone}
                  </p>
                )}
                {startup.address && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Address:</span> {startup.address}
                  </p>
                )}
              </div>
            </div>
          )}

          {startup.needs && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Needs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{startup.needs}</p>
            </div>
          )}

          {startup.founders && startup.founders.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Founders
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {startup.founders.map((founder, index) => (
                  <li key={index}>{founder}</li>
                ))}
              </ul>
            </div>
          )}

          {(startup.website_url || startup.social_media_url) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Links
              </h3>
              <div className="space-y-2">
                {startup.website_url && (
                  <a
                    href={startup.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Website
                  </a>
                )}
                {startup.social_media_url && (
                  <a
                    href={startup.social_media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 dark:text-blue-400 hover:underline"
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
