"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";

export default function PitchDeckPage() {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleExport = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: "#ffffff" // Force le fond blanc pour l'export
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("pitch-deck.pdf");
    } catch (err) {
      console.error("❌ Error exporting PDF:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Pitch Deck
      </h1>

      {/* Zone exportable */}
      <div
        ref={contentRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-xl w-full"
        style={{
          backgroundColor: '#ffffff', // Couleur de secours
          color: '#000000' // Couleur de secours
        }}
      >
        <h2 className="text-xl font-bold mb-4">Key Stats</h2>
        <ul className="space-y-2">
          <li>🚀 Startups: 42</li>
          <li>👀 Views: 12,870</li>
          <li>📈 Engagement: 37%</li>
        </ul>
      </div>

      <Link href="/" passHref>
        <button
          className="ml-auto p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg
            className={`w-6 h-6 transition-transform ${open ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5" />
            <path d="M12 5l-7 7 7 7" />
          </svg>
        </button>
      </Link>

      <button
        onClick={handleExport}
        className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-400 transition"
      >
        Export PDF
      </button>
    </div>
  );
}