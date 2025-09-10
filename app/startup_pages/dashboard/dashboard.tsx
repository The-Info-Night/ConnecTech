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
    { id: "partnerships", label: "Partnerships", value: 18, icon: "🤝", trend: "+3 this month" }
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
              trend: "Stable"
            },
            { id: "investors", label: "Active Investors", value: 1500, icon: "💰", trend: "+5 new" },
            { id: "funding", label: "Total Funding (M€)", value: 42, icon: "💎", trend: "+2.5M€ this quarter" },
            { id: "partnerships", label: "Partnerships", value: 18, icon: "🤝", trend: "+3 this month" }
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F18585] via-[#CB90F1] to-[#C174F2]">
      <p className="text-2xl text-white font-semibold">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F18585] via-[#CB90F1] to-[#C174F2] py-8 px-2">
      <main className="flex flex-col items-center w-full max-w-5xl">
        <header className="mb-8 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-[#7A3192] drop-shadow-lg text-center tracking-tight">Startup Dashboard</h1>
          <p className="text-lg text-[#a735f0] mt-2 text-center tracking-wide">
            Overview of your startup ecosystem performance and statistics
          </p>
        </header>
        <section className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mb-8">
          {statistics.map(({ id, label, value, icon, trend }) => (
            <article
              key={id}
              className="
                flex flex-col items-center justify-center
                bg-white bg-opacity-70 rounded-2xl px-6 py-8
                shadow-lg border-2 border-[#EED5FB]
                min-w-[220px] max-w-xs w-full
              "
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{icon}</span>
                <h2 className="text-lg font-semibold text-[#7A3192]">{label}</h2>
              </div>
              <p className="text-4xl font-extrabold text-[#C174F2] text-center mb-2">
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              <p className="mt-1 text-sm font-medium text-[#F49C9C]">{trend}</p>
            </article>
          ))}
        </section>
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 justify-items-center">
          <div className="w-full max-w-md bg-white bg-opacity-60 rounded-2xl p-6 shadow-lg border border-[#F6AEAE] flex flex-col items-center">
            <h3 className="text-xl font-bold text-[#F18585] mb-3">Featured Startups</h3>
            <div className="w-full flex flex-col gap-4">
              {[
                { name: "EcoTech", sector: "Green Technology", growth: "+32%" },
                { name: "HealthAI", sector: "Digital Health", growth: "+28%" },
                { name: "FinNext", sector: "FinTech", growth: "+45%" }
              ].map(({ name, sector, growth }, idx) => (
                <div key={idx} className="flex justify-between items-center w-full border-b border-[#EED5FB] pb-2 last:border-none">
                  <div>
                    <p className="font-medium text-[#7A3192]">{name}</p>
                    <p className="text-sm text-[#CB90F1]">{sector}</p>
                  </div>
                  <span className="flex items-center justify-center rounded-full bg-[#E4BEF8] min-w-[46px] h-8 px-3 text-xs font-semibold text-[#7A3192]">
                    {growth}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-md bg-white bg-opacity-60 rounded-2xl p-6 shadow-lg border border-[#C174F2] flex flex-col items-center">
            <h3 className="text-xl font-bold text-[#CB90F1] mb-3">Recent Investors</h3>
            <div className="w-full flex flex-col gap-4">
              {[
                { name: "VC Capital Plus", amount: "2.5M€", startup: "HealthAI" },
                { name: "Green Funds", amount: "1.8M€", startup: "EcoTech" },
                { name: "TechGrowth", amount: "3.2M€", startup: "FinNext" },
              ].map(({ name, amount, startup }, idx) => (
                <div key={idx} className="flex justify-between items-center w-full border-b border-[#EED5FB] pb-2 last:border-none">
                  <div>
                    <p className="font-medium text-[#7A3192]">{name}</p>
                    <p className="text-sm text-[#CB90F1]">Invested in {startup}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#C174F2] bg-[#F6AEAE]/40 px-3 py-1 rounded-xl">{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col items-center">
          <div className="rounded-2xl bg-white bg-opacity-60 p-6 shadow border border-[#F49C9C] text-center max-w-xl w-full">
            <h3 className="text-lg font-bold text-[#F49C9C] mb-2">Notes</h3>
            <p className="text-base text-[#7A3192]">
              Data displayed is from the table <code>data_adm_dashboard</code>.<br />
              If empty or unavailable, sample data is shown.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
