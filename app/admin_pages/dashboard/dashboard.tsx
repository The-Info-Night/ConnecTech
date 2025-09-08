"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

type DashboardRow = {
  startup_nb?: number | null;
  project_views?: number | null;
  engagment_rate?: number | string | null;
  engagement_rate?: number | string | null;
  tmp1?: number | null;
  tmp2?: number | null;
  tmp3?: number | null;
  tmp4?: number | null;
};

export default function DashboardPage({ sidebarOpen = false }: { sidebarOpen?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<DashboardRow[]>([]);
  const [pieData] = useState([
    { name: "Marketing", value: 400 },
    { name: "Tech", value: 300 },
    { name: "Design", value: 200 },
    { name: "Other", value: 100 },
  ]);
  const [barData] = useState([
    { name: "Jan", views: 4000, sales: 2400 },
    { name: "Feb", views: 3000, sales: 1398 },
    { name: "Mar", views: 2000, sales: 9800 },
    { name: "Apr", views: 2780, sales: 3908 },
    { name: "May", views: 1890, sales: 4800 },
  ]);

  async function fetchStatistics() {
    const { data, error } = await supabase
      .from("data_adm_dashboard")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  useEffect(() => {
    fetchStatistics()
      .then((data) => {
        if (data) setStatistics([data]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  if (loading)
    return <div className="p-6">Loading statistics...</div>;
  if (error)
    return <div className="p-6 text-red-500">Error : {error}</div>;

  const hideTitles = sidebarOpen;

  return (
    <div className="bg-[#1A1D21] min-h-screen p-2 md:p-4">
      <header className="max-w-6xl mx-auto mb-6 px-2 md:px-0">
        <h1
          className={`text-xl sm:text-2xl font-semibold tracking-tight transition-all duration-200
            ${hideTitles ? "hidden md:block" : ""}
          `}
        >
          Admin Dashboard
        </h1>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-gray rounded-lg p-3 sm:p-5 shadow">
            <h2
              className={`text-base sm:text-lg font-semibold mb-3 transition-all duration-200
                ${hideTitles ? "hidden md:block" : ""}
              `}
            >
              Budget Breakdown
            </h2>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-gray rounded-lg p-3 sm:p-5 shadow">
            <h2
              className={`text-base sm:text-lg font-semibold mb-3 transition-all duration-200
                ${hideTitles ? "hidden md:block" : ""}
              `}
            >
              Views & Sales per Month
            </h2>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" />
                  <Bar dataKey="sales" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[350px] flex-shrink-0">
          <div className="bg-gray rounded-xl p-4 sm:p-6 shadow-lg mt-2 lg:mt-0">
            <h2
              className={`text-base sm:text-xl font-bold mb-4 transition-all duration-200
                ${hideTitles ? "hidden md:block" : ""}
              `}
            >
              Statistics
            </h2>
            {statistics.map((stat, idx) => (
              <div key={idx} className="mb-4 space-y-1 text-[15px]">
                <p><span className="font-medium">Startups:</span> {stat.startup_nb ?? 0}</p>
                <p><span className="font-medium">Project Views:</span> {stat.project_views ?? 0}</p>
                <p><span className="font-medium">Engagement Rate:</span> {stat.engagment_rate ?? stat.engagement_rate ?? "0%"}</p>
                <p><span className="font-medium">Cost of items sold:</span> {stat.tmp1 ?? 0}</p>
                <p><span className="font-medium">Unique visitors:</span> {stat.tmp2 ?? 0}</p>
                <p><span className="font-medium">Product reviews:</span> {stat.tmp3 ?? 0}</p>
                <p><span className="font-medium">Blog traffic:</span> {stat.tmp4 ?? 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
