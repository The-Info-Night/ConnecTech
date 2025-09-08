"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type DashboardRow = {
  startup_nb?: number | null;
  project_nb?: number | null;
  project_views?: number | null;
  engagment_rate?: number | null;
  engagement_rate?: number | null;
};

export default function StartUpDashboardContent() {
  const [statistics, setStatistics] = useState([
    { id: "startups", label: "Startups", value: 0, icon: "🚀", trend: "+12% this month" },
    { id: "projectViews", label: "Project Views", value: 0, icon: "👁️", trend: "+8% this week" },
    { id: "engagementRate", label: "Engagement Rate", value: "0", icon: "💬", trend: "Stable" },
    { id: "investors", label: "Active Investors", value: 1500, icon: "💰", trend: "+5 new" },
    { id: "funding", label: "Total Funding (M€)", value: 42, icon: "💎", trend: "+2.5M€ this quarter" },
    { id: "partnerships", label: "Partnerships", value: 18, icon: "🤝", trend: "+3 this month" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const { data, error } = await supabase
          .from("data_adm_dashboard")
          .select("*")
          .limit(1)
          .maybeSingle<DashboardRow>();

        if (!error && data) {
          setStatistics([
            { id: "startups", label: "Startups", value: data.startup_nb ?? 0, icon: "🚀", trend: "+12% this month" },
            { id: "projectViews", label: "Project Views", value: data.project_views ?? 0, icon: "👁️", trend: "+8% this week" },
            {
              id: "engagementRate",
              label: "Engagement Rate",
              value:
                data.engagment_rate != null
                  ? typeof data.engagment_rate === "number"
                    ? `${data.engagment_rate}%`
                    : String(data.engagment_rate)
                  : "0%",
              icon: "💬",
              trend: "Stable",
            },
            { id: "investors", label: "Active Investors", value: 1500, icon: "💰", trend: "+5 new" },
            { id: "funding", label: "Total Funding (M€)", value: 42, icon: "💎", trend: "+2.5M€ this quarter" },
            { id: "partnerships", label: "Partnerships", value: 18, icon: "🤝", trend: "+3 this month" },
          ]);
        }
      } catch (e) {
        console.warn("Failed to load data; using fallback.", e);
      } finally {
        setLoading(false);
      }
    }

    fetchStatistics();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-400">Loading...</p>;

  return (
      <main className="mx-auto max-w-7xl px-4 py-10 ml-0 lg:ml-20 transition-all duration-300">
        <header className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Startup Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your startup ecosystem performance and statistics
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statistics.map(({ id, label, value, icon, trend }) => (
          <article
            key={id}
            className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-neutral-800/60 dark:bg-neutral-900"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</h2>
              </div>
              <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
            </div>
            <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-500">{trend}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Featured Startups</h3>
          <div className="mt-4 space-y-4">
            {[
              { name: "EcoTech", sector: "Green Technology", growth: "+32%" },
              { name: "HealthAI", sector: "Digital Health", growth: "+28%" },
              { name: "FinNext", sector: "FinTech", growth: "+45%" },
            ].map(({ name, sector, growth }, idx) => (
              <div key={idx} className="flex justify-between border-b border-neutral-200/60 dark:border-neutral-800/60 py-3">
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{sector}</p>
                </div>
                <span className="flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 min-w-[48px] h-8 px-3 text-xs font-medium text-green-800 dark:text-green-300">
                  {growth}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Recent Investors</h3>
          <div className="mt-4 space-y-4">
            {[
              { name: "VC Capital Plus", amount: "2.5M€", startup: "HealthAI" },
              { name: "Green Funds", amount: "1.8M€", startup: "EcoTech" },
              { name: "TechGrowth", amount: "3.2M€", startup: "FinNext" },
            ].map(({ name, amount, startup }, idx) => (
              <div key={idx} className="flex justify-between border-b border-neutral-200/60 dark:border-neutral-800/60 py-3">
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Invested in {startup}</p>
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Notes</h3>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Data displayed is from the table <code>data_adm_dashboard</code>. If empty or unavailable, sample data is shown.
        </p>
      </section>
    </main>
  );
}
