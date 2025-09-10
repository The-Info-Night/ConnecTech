"use client";
import { useEffect, useState } from "react";
import { getRows } from "@/lib/supabaseServices";

interface NewsItem {
  id: number;
  startup_id?: number | null;
  title: string;
  news_date?: string | null;
  location?: string | null;
  category?: string | null;
}

export default function NewsListContent() {
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
    return isNaN(d.getTime())
      ? s
      : window.innerWidth < 640
      ? d.toLocaleDateString()
      : d.toLocaleString();
  };

  return (
    <main className="w-full flex flex-col items-center px-2 sm:px-4 md:px-8 pt-14 pb-8 min-h-[76vh]">
      <section className="w-full max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-[#7A3192] text-center drop-shadow-lg">
          News
        </h1>
        {error && (
          <p className="text-red-400 mb-4 text-center">{error}</p>
        )}
        {loading ? (
          <p className="text-[#CB90F1] text-center">Loading...</p>
        ) : news.length === 0 ? (
          <p className="text-[#CB90F1] text-center">No news</p>
        ) : (
          <ul className="flex flex-col gap-5">
            {news
              .sort(
                (a, b) =>
                  new Date(b.news_date ?? 0).getTime() -
                  new Date(a.news_date ?? 0).getTime()
              )
              .map((item) => (
                <li key={item.id}>
                  <a
                    href={`/public_pages/news/${item.id}`}
                    className={`
                      block rounded-xl px-5 py-5 bg-white/80 border-2 border-[#EED5FB]
                      shadow hover:bg-[#EED5FB]/90 hover:shadow-lg
                      transition
                    `}
                  >
                    <h2 className="text-lg sm:text-xl font-bold text-[#7A3192] mb-1">
                      {item.title}
                    </h2>
                    <div className="text-xs text-[#CB90F1] mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      {item.news_date && <span>{formatDate(item.news_date)}</span>}
                      {item.location && <span>• {item.location}</span>}
                      {item.category && <span>• {item.category}</span>}
                    </div>
                  </a>
                </li>
              ))}
          </ul>
        )}
      </section>
    </main>
  );
}
