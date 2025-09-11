"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRowById } from "@/lib/supabaseServices";

interface NewsItem {
  id: number;
  startup_id?: number | null;
  title: string;
  news_date?: string | null;
  location?: string | null;
  category?: string | null;
}

export default function NewsDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
          "id,title,news_date,location,category"
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
    <div className="min-h-screen w-full font-sans">
      <main
        className="flex flex-col items-center min-h-[70vh] py-10 px-4 sm:px-6 md:px-12 lg:px-20 max-w-3xl mx-auto transition-all duration-300 pl-0 lg:pl-[14rem]"
      >
        <button
          type="button"
          onClick={() => router.push("/public_pages/news")}
          className="text-sm text-[#b046d4] hover:text-[#F18585] font-semibold mb-6 self-start transition"
        >
          ← Back
        </button>

        {error && <p className="text-center text-red-500">{error}</p>}

        {loading ? (
          <p className="text-center text-[#CB90F1]">Loading...</p>
        ) : item ? (
          <article className="bg-white rounded-xl p-8 w-full max-w-2xl border-2 border-[#EED5FB] shadow mx-auto">
            <h1 className="text-3xl font-extrabold mb-4 text-[#7A3192] text-left w-full break-words leading-snug">
              {item.title}
            </h1>
            <div className="text-sm text-[#CB90F1] mb-4 flex flex-wrap gap-x-4 gap-y-2">
              {item.news_date && <span>{formatDate(item.news_date)}</span>}
              {item.location && <span>{item.location}</span>}
              {item.category && <span>{item.category}</span>}
            </div>
          </article>
        ) : (
          <p className="text-center text-[#CB90F1]">Not found</p>
        )}
      </main>
    </div>
  );
}
