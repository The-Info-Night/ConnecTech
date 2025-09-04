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

export default function DashboardPage() {
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<DashboardRow[]>([]);
  const [pieData, setPieData] = useState([
    { name: "Marketing", value: 400 },
    { name: "Tech", value: 300 },
    { name: "Design", value: 200 },
    { name: "Other", value: 100 },
  ]);

  const [barData, setBarData] = useState([
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
    return <div className="p-6">Chargement des statistiques...</div>;
  if (error)
    return <div className="p-6 text-red-500">Erreur : {error}</div>;

  return (
    <div className="relative p-6 left-6 bg-dark-100 min-h-screen">
      {/* Charts derrière */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Budget Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
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

        <div className="bg-gray shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Views & Sales per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
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

      {/* AdminDashboardPage devant */}
      <div className="relative top-6 left-6 w-full lg:w-1/3 bg-gray shadow-lg rounded-xl p-6 z-20">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {statistics.map((stat, idx) => (
          <div key={idx} className="mb-4">
            <p><span className="font-medium">Startups:</span> {stat.startup_nb ?? 0}</p>
            <p><span className="font-medium">Project Views:</span> {stat.project_views ?? 0}</p>
            <p><span className="font-medium">Engagement Rate:</span> {stat.engagment_rate ?? stat.engagement_rate ?? "0%"}</p>
            <p><span className="font-medium">Cost of items sold:</span> {stat.tmp1 ?? 0}</p>
            <p><span className="font-medium">Number of unique visitors:</span> {stat.tmp2 ?? 0}</p>
            <p><span className="font-medium">Number of product reviews:</span> {stat.tmp3 ?? 0}</p>
            <p><span className="font-medium">Blog traffic:</span> {stat.tmp4 ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
