import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;

type DashboardRow = {
  startup_nb?: number | null;
  project_views?: number | null;
  engagment_rate?: number | string | null;
  engagement_rate?: number | string | null;
};

export default async function StartUpDashboardPage() {
  let statistics = [
    { id: "startups", label: "Startups", value: 0, icon: "🚀", trend: "+12% this month" },
    { id: "projectViews", label: "Project Views", value: 0, icon: "👁️", trend: "+8% this week" },
    { id: "engagementRate", label: "Engagement Rate", value: "0", icon: "💬", trend: "Stable" },
    { id: "investors", label: "Active Investors", value: 1500, icon: "💰", trend: "+5 new" },
    { id: "funding", label: "Total Funding (M€)", value: 42, icon: "💎", trend: "+2.5M€ this quarter" },
    { id: "partnerships", label: "Partnerships", value: 18, icon: "🤝", trend: "+3 this month" },
  ];

  try {
    const { data, error } = await supabase
      .from("data_adm_dashboard")
      .select("*")
      .limit(1)
      .maybeSingle<DashboardRow>();

    if (!error && data) {
      statistics = [
        { 
          id: "startups", 
          label: "Startups", 
          value: data.startup_nb ?? 0, 
          icon: "🚀", 
          trend: "+12% this month" 
        },
        { 
          id: "projectViews", 
          label: "Project Views", 
          value: data.project_views ?? 0, 
          icon: "👁️", 
          trend: "+8% this week" 
        },
        {
          id: "engagementRate",
          label: "Engagement Rate",
          value: (() => {
            const raw = (data.engagment_rate ?? data.engagement_rate) as number | string | null | undefined;
            if (raw == null) return "0%";
            if (typeof raw === "number") return `${raw}%`;
            return raw.toString().endsWith("%") ? raw.toString() : `${raw}`;
          })(),
          icon: "💬",
          trend: "Stable"
        },
        { 
          id: "investors", 
          label: "Active Investors", 
          value: 1500, 
          icon: "💰", 
          trend: "+5 new" 
        },
        { 
          id: "funding", 
          label: "Total Funding (M€)", 
          value: 42, 
          icon: "💎", 
          trend: "+2.5M€ this quarter" 
        },
        { 
          id: "partnerships", 
          label: "Partnerships", 
          value: 18, 
          icon: "🤝", 
          trend: "+3 this month" 
        },
      ];
    }
  } catch (e) {
    console.warn("Failed to load dashboard data; showing fallback values.", e);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Startup Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview of your startup ecosystem performance and statistics
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statistics.map((stat) => (
          <article
            key={stat.id}
            className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-neutral-800/60 dark:bg-neutral-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {stat.label}
                  </h2>
                </div>
                <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : String(stat.value)}
                </p>
                <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-500">
                  {stat.trend}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Featured Startups
          </h3>
          <div className="mt-4 space-y-4">
            {[
              { name: "EcoTech", sector: "Green Technology", growth: "+32%" },
              { name: "HealthAI", sector: "Digital Health", growth: "+28%" },
              { name: "FinNext", sector: "FinTech", growth: "+45%" },
            ].map((startup, index) => (
              <div key={index} className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                <div>
                  <p className="font-medium">{startup.name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{startup.sector}</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {startup.growth}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Recent Investors
          </h3>
          <div className="mt-4 space-y-4">
            {[
              { name: "VC Capital Plus", amount: "2.5M€", startup: "HealthAI" },
              { name: "Green Funds", amount: "1.8M€", startup: "EcoTech" },
              { name: "TechGrowth", amount: "3.2M€", startup: "FinNext" },
            ].map((investor, index) => (
              <div key={index} className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                <div>
                  <p className="font-medium">{investor.name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Invested in {investor.startup}</p>
                </div>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{investor.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Notes</h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Data displayed is pulled from the Supabase table "data_adm_dashboard". 
          If the table is empty or unreachable, sample values are shown.
        </p>
      </section>
    </main>
  );
}