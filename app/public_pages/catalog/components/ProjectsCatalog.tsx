"use client";
import { useEffect, useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import { getRows, getStartups, searchStartups, getDistinctValues, getFilteredStartups, getRowById } from "@/lib/supabaseServices";
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
  const [sector, setSector] = useState<string>("");
  const [status, setStatus] = useState<string>("");
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
        const hasFilters = (sector && sector !== "") || (status && status !== "");
        if (debouncedQuery.trim().length === 0 && !hasFilters) {
          const data = await getRows<Startup>("startups", "id,name,description,sector,project_status,website_url,legal_status,address,email,phone,social_media_url,maturity,needs,founders");
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
      } catch (e: unknown) {
        const anyErr = e as { message?: string } | null;
        const message = anyErr?.message ?? "Unknown error";
        console.error("Startup fetch/search error:", e);
        if (!isCancelled) setError(message);
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
      } catch (e) {
      }
    }
    loadOptions();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCardClick = async (startupId: number) => {
    try {
      const fullStartup = await getRowById<Startup>("startups", startupId, "id,name,description,sector,needs,project_status,website_url,legal_status,address,email,phone,social_media_url,maturity,founders");
      if (fullStartup) {
        setSelectedStartup(fullStartup);
        setIsModalOpen(true);
      }
    } catch (e) {
      console.error("Error fetching startup details:", e);
    }
  };

  return (
    <div className="container mx-auto py-10 w-full">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
        Catalog des Startups
      </h2>

      <div className="w-full max-w-4xl mx-auto px-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une startup par nom ou description..."
          className="md:col-span-2 w-full rounded-lg bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="w-full rounded-lg bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none"
        >
          <option value="">Secteur (tous)</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none"
        >
          <option value="">Statut (tous)</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-center text-red-500 mb-6 px-4">{error}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-400">Chargement...</p>
      ) : startups.length === 0 ? (
        <p className="text-center text-gray-400">Aucun résultat</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
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

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}