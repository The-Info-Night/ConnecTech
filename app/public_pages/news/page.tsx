"use client";
import { useEffect, useState } from "react";
import SideNavbar from "../../components/SideNavbar";
import { getRows } from "@/lib/supabaseServices";

interface NewsItem {
  id: number;
  startup_id?: number | null;
  title: string;
  news_date?: string | null;
  location?: string | null;
  category?: string | null;
}

export default function NewsListPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    async function loadNews() {
      setLoading(true);
      setError(null);
      try {
        const items = await getRows<NewsItem>(
          "news",
          "id,startup_id,title,news_date,location,category"
        );
        if (!isCancelled) setNews(items);
      } catch (e) {
        const msg = (e as { message?: string } | null)?.message ?? "Unknown error";
        if (!isCancelled) setError(msg);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    loadNews();
    return () => {
      isCancelled = true;
    };
  }, []);

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
          <h1 className="text-3xl font-bold mb-6 text-gray-100">News</h1>

          {error && <p className="text-red-400 mb-4">{error}</p>}
          {loading ? (
            <p className="text-gray-400">Chargement...</p>
          ) : news.length === 0 ? (
            <p className="text-gray-400">Aucune news</p>
          ) : (
            <ul className="space-y-4">
              {news
                .sort((a, b) => (new Date(b.news_date ?? 0).getTime()) - (new Date(a.news_date ?? 0).getTime()))
                .map((item) => (
                  <li key={item.id} className="bg-gray-800 rounded-lg p-4">
                    <a href={`/public_pages/news/${item.id}`} className="block">
                      <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                      <div className="text-xs text-gray-400 mt-1 flex gap-3 flex-wrap">
                        {item.news_date && <span>{formatDate(item.news_date)}</span>}
                        {item.location && <span>• {item.location}</span>}
                        {item.category && <span>• {item.category}</span>}
                      </div>
                    </a>
                  </li>
                ))}
            </ul>
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
