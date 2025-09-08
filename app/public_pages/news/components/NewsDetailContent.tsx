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
    <main
      className="flex flex-col items-center justify-start min-h-[70vh] py-10 px-4 sm:px-6 md:px-12 lg:px-20 max-w-4xl mx-auto"
      style={{ marginTop: "56px" }}
    >
      <button
        type="button"
        onClick={() => router.push("/public_pages/news")}
        className="text-sm text-blue-500 hover:underline mb-6 self-start"
      >
        ← Back
      </button>

      {error && <p className="text-center text-red-500">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : item ? (
        <article className="bg-gray-800 dark:bg-gray-900 rounded-lg p-6 text-white w-full">
          <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
          <div className="text-sm text-gray-400 flex flex-wrap gap-x-4 gap-y-2">
            {item.news_date && <span>{formatDate(item.news_date)}</span>}
            {item.location && <span>{item.location}</span>}
            {item.category && <span>{item.category}</span>}
          </div>
        </article>
      ) : (
        <p className="text-center text-gray-400">Not found</p>
      )}
    </main>
  );
}
