"use client";

import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { getRows, getFilteredStartups, getDistinctValues, getRowById } from "@/lib/supabaseServices";
import StartupModal from "./StartupModal";

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

export default function ProjectsCatalog() {
  const [query, setQuery] = useState("");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("");
  const [sectors, setSectors] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    let isCancelled = false;
    async function fetchStartups() {
      setLoading(true);
      setError(null);
      try {
        const hasFilters = sector !== "" || status !== "";
        if (debouncedQuery.trim() === "" && !hasFilters) {
          const data = await getRows<Startup>(
            "startups",
            "id,name,description,sector,project_status,website_url,legal_status,address,email,phone,social_media_url,maturity,needs,founders"
          );
          if (!isCancelled) setStartups(data);
        } else {
          const data = await getFilteredStartups({
            sector: sector || null,
            project_status: status || null,
            search: debouncedQuery || null,
            limit: 200,
          });
          if (!isCancelled) setStartups(data);
        }
      } catch (e: any) {
        if (!isCancelled) {
          setError(e.message || "Unexpected error");
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchStartups();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, sector, status]);

  useEffect(() => {
    let isCancelled = false;
    async function loadOptions() {
      try {
        const [sectorsData, statusesData] = await Promise.all([
          getDistinctValues("startups", "sector"),
          getDistinctValues("startups", "project_status"),
        ]);
        if (!isCancelled) {
          setSectors(sectorsData);
          setStatuses(statusesData);
        }
      } catch {
        // Ignore errors here silently
      }
    }
    loadOptions();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCardClick = async (startupId: number) => {
    try {
      const fullStartup = await getRowById<Startup>(
        "startups",
        startupId,
        "id,name,description,sector,needs,project_status,website_url,legal_status,address,email,phone,social_media_url,maturity,founders"
      );
      if (fullStartup) {
        setSelectedStartup(fullStartup);
        setIsModalOpen(true);
      }
    } catch (e) {
      console.error("Error fetching startup details:", e);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-gray-100">
        Startup catalog
      </h2>

      {/* Filtres alignés et responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a startup by name or description..."
          className="col-span-1 sm:col-span-2 md:col-span-2 w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sector (all)</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Status (all)</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-center text-red-500 mb-6 px-4">{error}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : startups.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No results</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <ProjectCard
              key={startup.id}
              title={startup.name}
              description={startup.description ?? ""}
              subtitle={[startup.sector, startup.project_status].filter(Boolean).join(" • ")}
              onClick={() => handleCardClick(startup.id)}
            />
          ))}
        </div>
      )}

      <StartupModal
        startup={selectedStartup}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStartup(null);
        }}
      />
    </div>
  );
}

// Debounce helper
function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}
