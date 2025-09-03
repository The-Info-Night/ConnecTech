import { supabase } from "@/lib/supabaseClient";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";

export default function PitchDeckPage(){
    const contentRef = useRef<HTMLDivElement | null>(null);

    const handleExport = async () => {
      if (!contentRef.current) return;

      try {
        const canvas = await html2canvas(contentRef.current, {
          scale: 2,
          backgroundColor: "#ffffff"
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
      <div className="font-sans min-h-screen" style={{ backgroundColor: "#1A1D21" }}>
        {/* Main content */}
        <main
          className="flex flex-col items-center justify-center min-h-[70vh] py-16 ml-0 md:ml-56 transition-all duration-300"
          style={{
        marginLeft: "var(--side-navbar-width, 14rem)",
        backgroundColor: "#1A1D21",
          }}
        >
          <h1 className="text-3xl font-bold mb-6" style={{ color: "#ffffffff" }}>
        Pitch Deck
          </h1>

          {/* Zone exportable */}
          <div
        ref={contentRef}
        className="p-6 rounded-xl shadow-md max-w-xl w-full"
        style={{
          backgroundColor: "#ffffffff",
          color: "#000000ff",
        }}
          >
        <h2 className="text-xl font-bold mb-4" style={{ color: "#000000ff" }}>
          Key Stats
        </h2>
        <ul className="space-y-2">
          <li>🚀 Startups: 42</li>
          <li>👀 Views: 12,870</li>
          <li>📈 Engagement: 37%</li>
        </ul>
          </div>

          <div className="group">
        <button
          onClick={handleExport}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 border shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5"
          style={{
            backgroundColor: "#ffffffff",
            color: "#000000ff",
            borderColor: "#ffffff",
          }}
        >
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "#000000ff" }}
          >
            <path strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export to PDF
        </button>
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
