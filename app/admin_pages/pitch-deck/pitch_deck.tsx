"use client";

import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import { Download } from "lucide-react";

export default function PitchDeckPage({ sidebarOpen = false }: { sidebarOpen?: boolean }) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [loadingExport, setLoadingExport] = useState(false);

  const handleExport = async () => {
    if (!contentRef.current) return;
    setLoadingExport(true);
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
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <main
        className={`flex flex-col items-center justify-center min-h-screen py-10 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-20 transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? "var(--sidebar-width, 14rem)" : "var(--sidebar-collapsed-width, 4rem)" }}
      >
        {/* Responsive header with smaller font on small screens */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center sm:text-left">
          Connectech Pitch Deck
        </h1>

        {/* Container */}
        <div
          ref={contentRef}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-screen-lg overflow-hidden"
          style={{ color: sidebarOpen ? '#000' : '#fff' }}
        >
          {/* Cover Slide */}
          <section className="text-center mb-10 border-b border-gray-300 dark:border-gray-700 pb-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connectech
            </h2>
            <p className="text-xl sm:text-2xl mb-3 text-gray-700 dark:text-gray-300 font-semibold">
              Revolutionizing the Future of Technology
            </p>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Pitch Deck | 2025</p>
          </section>

          {/* Problem Slide */}
          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400 border-b border-blue-700 dark:border-blue-400 pb-2">
              The Problem
            </h3>
            <ul className="list-disc list-inside space-y-4 text-base sm:text-lg text-gray-800 dark:text-gray-200">
              <li>Current solutions are inefficient and outdated</li>
              <li>Businesses lose $X billion annually due to inefficiencies</li>
              <li>No integrated platform addresses all customer needs</li>
            </ul>
          </section>

          {/* Solution Slide */}
          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400 border-b border-blue-700 dark:border-blue-400 pb-2">
              Our Solution
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
              <h4 className="text-xl sm:text-2xl font-semibold mb-5 text-blue-800 dark:text-blue-300">
                The Connectech Platform
              </h4>
              <p className="text-lg mb-5 text-gray-800 dark:text-gray-300">
                A comprehensive SaaS solution that:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-gray-700 dark:text-gray-200">
                {[
                  "Increases efficiency by 40%",
                  "Reduces costs by 30%",
                  "Improves customer satisfaction",
                  "Scalable architecture",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-700 p-2 rounded-full mr-3 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Market Opportunity */}
          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-blue-700 dark:text-blue-400 border-b border-blue-700 dark:border-blue-400 pb-2">
              Market Opportunity
            </h3>
            <div className="flex flex-col sm:flex-row justify-around gap-6 sm:gap-0">
              {[
                { value: "$42B", label: "Total Addressable Market", color: "text-blue-600" },
                { value: "$12B", label: "Serviceable Addressable Market", color: "text-green-600" },
                { value: "$850M", label: "Serviceable Obtainable Market", color: "text-purple-600" },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className={`text-3xl sm:text-4xl font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Traction */}
          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 border-b border-blue-700 dark:border-blue-400 pb-2">
              Traction
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">42%</div>
                <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300">MoM Growth</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">250+</div>
                <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Active Clients</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">98%</div>
                <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Retention Rate</div>
              </div>
            </div>
            <div className="mt-8 bg-green-50 dark:bg-green-900 p-6 rounded-lg">
              <h4 className="text-xl sm:text-2xl font-semibold mb-4 text-green-800 dark:text-green-300">Recent Milestones</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Closed $5M Series A funding</li>
                <li>Launched v2.0 with AI capabilities</li>
                <li>Partnership with Industry Leader Inc.</li>
              </ul>
            </div>
          </section>

          {/* Business Model */}
          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 border-b border-blue-700 dark:border-blue-400 pb-2">
              Business Model
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg text-center">
                <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-blue-800 dark:text-blue-300">SaaS Subscription</h4>
                <p className="text-2xl font-bold mb-1">$99-499/mo</p>
                <p className="text-sm text-gray-700 dark:text-gray-400">Tiered pricing</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg text-center">
                <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-green-800 dark:text-green-300">Enterprise</h4>
                <p className="text-2xl font-bold mb-1">Custom</p>
                <p className="text-sm text-gray-700 dark:text-gray-400">White-label solutions</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg text-center">
                <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-purple-800 dark:text-purple-300">Marketplace</h4>
                <p className="text-2xl font-bold mb-1">15% fee</p>
                <p className="text-sm text-gray-700 dark:text-gray-400">Transaction commission</p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 border-b border-blue-700 dark:border-blue-400 pb-2">
              Our Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full mr-4 flex items-center justify-center dark:bg-blue-700">
                  <span className="text-xl font-semibold text-blue-900 dark:text-blue-200">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Jane Doe</h4>
                  <p className="text-gray-700 dark:text-gray-300">CEO, Former Google PM</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-green-200 rounded-full mr-4 flex items-center justify-center dark:bg-green-700">
                  <span className="text-xl font-semibold text-green-900 dark:text-green-200">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">John Smith</h4>
                  <p className="text-gray-700 dark:text-gray-300">CTO, Ex-Microsoft</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-purple-200 rounded-full mr-4 flex items-center justify-center dark:bg-purple-700">
                  <span className="text-xl font-semibold text-purple-900 dark:text-purple-200">AJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Alice Johnson</h4>
                  <p className="text-gray-700 dark:text-gray-300">CPO, UX Expert</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-yellow-200 rounded-full mr-4 flex items-center justify-center dark:bg-yellow-700">
                  <span className="text-xl font-semibold text-yellow-900 dark:text-yellow-200">RS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Robert Brown</h4>
                  <p className="text-gray-700 dark:text-gray-300">CFO, Financial Strategist</p>
                </div>
              </div>
            </div>
          </section>

          {/* Financial Projections */}
          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 border-b border-blue-700 dark:border-blue-400 pb-2">
              Financial Projections
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-900">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="py-3 px-4 text-left">Metric</th>
                    <th className="py-3 px-4 text-right">2024</th>
                    <th className="py-3 px-4 text-right">2025</th>
                    <th className="py-3 px-4 text-right">2026</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4">Revenue</td>
                    <td className="py-3 px-4 text-right">$2.5M</td>
                    <td className="py-3 px-4 text-right">$8.7M</td>
                    <td className="py-3 px-4 text-right">$22.4M</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4">Gross Margin</td>
                    <td className="py-3 px-4 text-right">75%</td>
                    <td className="py-3 px-4 text-right">78%</td>
                    <td className="py-3 px-4 text-right">82%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4">Customers</td>
                    <td className="py-3 px-4 text-right">850</td>
                    <td className="py-3 px-4 text-right">2,400</td>
                    <td className="py-3 px-4 text-right">5,800</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Ask Slide */}
          <section className="mb-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-blue-700 dark:text-blue-400 border-b border-blue-700 dark:border-blue-400 pb-2">
              We're Raising $8M
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg text-gray-900 dark:text-white">
              <p className="text-lg mb-5">Join our mission to revolutionize the industry</p>
              <div className="flex flex-col md:flex-row justify-around gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">$5M</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Already Committed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">$3M</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Remaining</div>
                </div>
              </div>
              <p className="mt-4 text-lg font-semibold">Contact: <a href="mailto:invest@.com" className="text-blue-600">invest@.com</a></p>
            </div>
          </section>

          {/* Export button */}
          <div className="group mt-8 max-w-6xl mx-auto px-4 sm:px-0">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white font-bold shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              disabled={loadingExport}
            >
              <Download className="w-5 h-5" />
              {loadingExport ? "Exporting..." : "Extract as PDF"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
