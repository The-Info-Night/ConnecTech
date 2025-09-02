import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;

type DashboardRow = {
  startup_nb?: number | null;
  project_views?: number | null;
  engagment_rate?: number | string | null;
  engagement_rate?: number | string | null;
};

export default async function AdminDashboardPage() {
  let statistics = [
    { id: "startups", label: "Startups", value: 0 },
    { id: "projectViews", label: "Project Views", value: 0 },
    { id: "engagementRate", label: "Engagement Rate", value: "0" },
  ];

  try {
    const { data, error } = await supabase
      .from("data_adm_dashboard")
      .select("*")
      .limit(1)
      .maybeSingle<DashboardRow>();

    if (!error && data) {
      statistics = [
        { id: "startups", label: "Startups", value: data.startup_nb ?? 0 },
        { id: "projectViews", label: "Project Views", value: data.project_views ?? 0 },
        {
          id: "engagementRate",
          label: "Engagement Rate",
          value: (() => {
            const raw = (data.engagment_rate ?? data.engagement_rate) as number | string | null | undefined;
            if (raw == null) return "0%";
            if (typeof raw === "number") return `${raw}%`;
            return raw.toString().endsWith("%") ? raw.toString() : `${raw}`;
          })(),
        },
      ];
    }
  } catch (e) {
    console.warn("Failed to load dashboard data; showing fallback values.", e);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statistics.map((stat) => (
          <article
            key={stat.id}
            className="rounded-xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-medium text-neutral-500">{stat.label}</h2>
                <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : String(stat.value)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                <span className="text-base">↗</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900">
        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Notes</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Data displayed above is pulled from the Supabase table "data_adm_dashboard". If the table is empty or unreachable, fallback sample values are shown.
        </p>
      </section>
    </main>
  );
}


