"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SideNavbar from "../../../components/SideNavbar";
import { getRowById } from "@/lib/supabaseServices";

interface NewsItem {
  id: number;
  startup_id?: number | null;
  title: string;
  news_date?: string | null;
  location?: string | null;
  category?: string | null;
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const newsItem = await getRowById<NewsItem>(
          "news",
          id,
          "id,startup_id,title,news_date,location,category"
        );
        if (!isCancelled) setItem(newsItem);
      } catch (e) {
        const msg = (e as { message?: string } | null)?.message ?? "Unknown error";
        if (!isCancelled) setError(msg);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    load();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  const formatDate = (s?: string | null) => {
    if (!s) return "";
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleString();
  };

  return (
    <div className="font-sans min-h-screen" style={{ backgroundColor: "#1A1D21" }}>
      <SideNavbar />
      <main
        className="flex flex-col items-center justify-start min-h-[70vh] py-16 ml-0 md:ml-56 transition-all duration-300 w-full"
        style={{ marginLeft: "var(--side-navbar-width, 14rem)" }}
      >
        <div className="w-full max-w-3xl px-4">
          <a href="/public_pages/news" className="text-blue-400 hover:underline">← Retour</a>
          {error && <p className="text-red-400 mt-4">{error}</p>}
          {loading ? (
            <p className="text-gray-400 mt-4">Chargement...</p>
          ) : !item ? (
            <p className="text-gray-400 mt-4">Introuvable</p>
          ) : (
            <article className="bg-gray-800 rounded-lg p-6 mt-4">
              <h1 className="text-3xl font-bold text-white">{item.title}</h1>
              <div className="text-xs text-gray-400 mt-1 flex gap-3 flex-wrap">
                {item.news_date && <span>{formatDate(item.news_date)}</span>}
                {item.location && <span>• {item.location}</span>}
                {item.category && <span>• {item.category}</span>}
              </div>
            </article>
          )}
        </div>
      </main>
      <style jsx global>{`
        @media (min-width: 768px) {
          :root {
            --side-navbar-width: 14rem;
          }
        }
        @media (max-width: 767px) {
          :root {
            --side-navbar-width: 4rem;
          }
        }
      `}</style>
    </div>
  );
}
