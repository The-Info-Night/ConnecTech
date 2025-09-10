"use client";

import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

export default function PitchDeckPage({ sidebarOpen = false }: { sidebarOpen?: boolean }) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleExport = () => {
    const doc = new jsPDF();
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Connectech Pitch Deck", 10, 20);
  
    let y = 30;
  
    const addSection = (title: string, content: string[] | string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, 10, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
  
      if (Array.isArray(content)) {
        content.forEach(line => {
          doc.text(line, 15, y);
          y += 6;
        });
      } else {
        doc.text(content, 15, y, { maxWidth: 180 });
        y += 12;
      }
      y += 3;
    };
  
    addSection("The Problem", [
      "• Current solutions are inefficient and outdated",
      "• Businesses lose $X billion annually due to inefficiencies",
      "• No integrated platform addresses all customer needs"
    ]);
  
    addSection("Our Solution",
      "A comprehensive SaaS solution that increases efficiency by 40%, reduces costs by 30%, improves customer satisfaction, and offers a scalable architecture."
    );
  
    addSection("Market Opportunity", [
      "• TAM: $42B", "• SAM: $12B", "• SOM: $850M"
    ]);
  
    addSection("Traction", [
      "• 42% MoM Growth",
      "• 250+ Active Clients",
      "• 98% Retention Rate",
      "Milestones: $5M Series A, launched v2.0 AI, partnership with Industry Leader Inc."
    ]);
  
    addSection("Business Model", [
      "• SaaS Subscription ($99–499/mo)",
      "• Enterprise (Custom, white-label)",
      "• Marketplace (15% commission)"
    ]);
  
    addSection("Our Team", [
      "• Jane Doe – CEO (ex-Google)",
      "• John Smith – CTO (ex-Microsoft)",
      "• Alice Johnson – CPO (UX Expert)",
      "• Robert Brown – CFO (Strategist)"
    ]);
  
    addSection("Financial Projections", [
      "• 2024: $2.5M revenue, 75% margin, 850 customers",
      "• 2025: $8.7M revenue, 78% margin, 2400 customers",
      "• 2026: $22.4M revenue, 82% margin, 5800 customers"
    ]);
  
    addSection("Fundraising", [
      "We’re raising $8M (already $5M committed, $3M remaining).",
      "Contact: invest@.com"
    ]);
  
    doc.save("pitch-deck.pdf");
  };
  
  const PALETTE = {
    rose: "#F18585",
    saumon: "#F49C9C",
    pêche: "#F6AEAE",
    rosé: "#F8CACF",
    lavande: "#EED5FB",
    violetPastel: "#CB90F1",
    violetAccent: "#C174F2",
    lavandeFoncé: "#D5A8F2",
    violetTitre: "#7A3192",
  };

  return (
    <div
      className="font-sans min-h-screen w-full transition-colors duration-300"
      style={{
        background:
          "linear-gradient(180deg, #F18585 0%, #F49C9C 18%, #F6AEAE 34%, #F8CACF 50%, #EED5FB 56%, #E4BEF8 72%, #D5A8F2 85%, #CB90F1 94%, #C174F2 100%)",
      }}
    >
      <main
        className={`flex flex-col items-center justify-center min-h-screen py-10 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-20 transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? "var(--sidebar-width, 14rem)" : "var(--sidebar-collapsed-width, 4rem)" }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-[#7A3192] text-center sm:text-left drop-shadow-lg">
          Connectech Pitch Deck
        </h1>

        <div
          ref={contentRef}
          className="bg-white/90 rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-screen-lg border-2 border-[#EED5FB] overflow-hidden"
        >
          <section className="text-center mb-10 border-b border-[#CB90F1] pb-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#CB90F1] to-[#F18585] bg-clip-text text-transparent">
              Connectech
            </h2>
            <p className="text-xl sm:text-2xl mb-3 text-[#7A3192] font-semibold">
              Revolutionizing the Future of Technology
            </p>
            <p className="text-sm sm:text-base text-[#CB90F1]">Pitch Deck | 2025</p>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-[#CB90F1] border-b border-[#CB90F1] pb-2">
              The Problem
            </h3>
            <ul className="list-disc list-inside space-y-4 text-base sm:text-lg text-[#7A3192]">
              <li>Current solutions are inefficient and outdated</li>
              <li>Businesses lose $X billion annually due to inefficiencies</li>
              <li>No integrated platform addresses all customer needs</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-[#CB90F1] border-b border-[#CB90F1] pb-2">
              Our Solution
            </h3>
            <div className="bg-[#EED5FB]/70 p-6 rounded-lg">
              <h4 className="text-xl sm:text-2xl font-semibold mb-5 text-[#C174F2]">
                The Connectech Platform
              </h4>
              <p className="text-lg mb-5 text-[#7A3192]">
                A comprehensive SaaS solution that:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[#b358ed]">
                {[
                  "Increases efficiency by 40%",
                  "Reduces costs by 30%",
                  "Improves customer satisfaction",
                  "Scalable architecture",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="bg-[#CB90F1]/20 text-[#CB90F1] p-2 rounded-full mr-3 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-[#CB90F1] border-b border-[#CB90F1] pb-2">
              Market Opportunity
            </h3>
            <div className="flex flex-col sm:flex-row justify-around gap-6 sm:gap-0">
              {[
                { value: "$42B", label: "Total Addressable Market", color: "text-[#F18585]" },
                { value: "$12B", label: "Serviceable Addressable Market", color: "text-[#F49C9C]" },
                { value: "$850M", label: "Serviceable Obtainable Market", color: "text-[#CB90F1]" },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className={`text-3xl sm:text-4xl font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-sm sm:text-base text-[#7A3192]">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[#CB90F1] border-b border-[#CB90F1] pb-2">
              Traction
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-[#EED5FB]/60 p-5 rounded-lg">
                <div className="text-3xl sm:text-4xl font-bold text-[#F49C9C]">42%</div>
                <div className="text-sm sm:text-base text-[#7A3192]">MoM Growth</div>
              </div>
              <div className="bg-[#EED5FB]/60 p-5 rounded-lg">
                <div className="text-3xl sm:text-4xl font-bold text-[#F18585]">250+</div>
                <div className="text-sm sm:text-base text-[#7A3192]">Active Clients</div>
              </div>
              <div className="bg-[#EED5FB]/60 p-5 rounded-lg">
                <div className="text-3xl sm:text-4xl font-bold text-[#CB90F1]">98%</div>
                <div className="text-sm sm:text-base text-[#7A3192]">Retention Rate</div>
              </div>
            </div>
            <div className="mt-8 bg-[#F8CACF]/60 p-6 rounded-lg">
              <h4 className="text-xl sm:text-2xl font-semibold mb-4 text-[#F18585]">Recent Milestones</h4>
              <ul className="list-disc list-inside space-y-2 text-[#7A3192]">
                <li>Closed $5M Series A funding</li>
                <li>Launched v2.0 with AI capabilities</li>
                <li>Partnership with Industry Leader Inc.</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[#CB90F1] border-b border-[#CB90F1] pb-2">
              Business Model
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#EED5FB]/80 p-6 rounded-lg text-center">
                <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-[#C174F2]">SaaS Subscription</h4>
                <p className="text-2xl font-bold mb-1 text-[#F18585]">$99-499/mo</p>
                <p className="text-sm text-[#CB90F1]">Tiered pricing</p>
              </div>
              <div className="bg-[#EED5FB]/80 p-6 rounded-lg text-center">
                <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-[#F49C9C]">Enterprise</h4>
                <p className="text-2xl font-bold mb-1 text-[#C174F2]">Custom</p>
                <p className="text-sm text-[#CB90F1]">White-label solutions</p>
              </div>
              <div className="bg-[#EED5FB]/80 p-6 rounded-lg text-center">
                <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-[#F18585]">Marketplace</h4>
                <p className="text-2xl font-bold mb-1 text-[#CB90F1]">15% fee</p>
                <p className="text-sm text-[#CB90F1]">Transaction commission</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[#CB90F1] border-b border-[#CB90F1] pb-2">
              Our Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-[#D5A8F2] rounded-full mr-4 flex items-center justify-center">
                  <span className="text-xl font-semibold text-[#7A3192]">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7A3192]">Jane Doe</h4>
                  <p className="text-[#CB90F1]">CEO, Former Google PM</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-[#CB90F1] rounded-full mr-4 flex items-center justify-center">
                  <span className="text-xl font-semibold text-white">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7A3192]">John Smith</h4>
                  <p className="text-[#CB90F1]">CTO, Ex-Microsoft</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-[#EED5FB] rounded-full mr-4 flex items-center justify-center">
                  <span className="text-xl font-semibold text-[#C174F2]">AJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7A3192]">Alice Johnson</h4>
                  <p className="text-[#CB90F1]">CPO, UX Expert</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-[#F6AEAE] rounded-full mr-4 flex items-center justify-center">
                  <span className="text-xl font-semibold text-[#CB90F1]">RS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7A3192]">Robert Brown</h4>
                  <p className="text-[#CB90F1]">CFO, Financial Strategist</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[#CB90F1] border-b border-[#CB90F1] pb-2">
              Financial Projections
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-[#F8CACF]">
                    <th className="py-3 px-4 text-left text-[#7A3192]">Metric</th>
                    <th className="py-3 px-4 text-right text-[#7A3192]">2024</th>
                    <th className="py-3 px-4 text-right text-[#7A3192]">2025</th>
                    <th className="py-3 px-4 text-right text-[#7A3192]">2026</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#EED5FB] text-[#CB90F1]">
                    <td className="py-3 px-4 text-[#CB90F1]">Revenue</td>
                    <td className="py-3 px-4 text-right">$2.5M</td>
                    <td className="py-3 px-4 text-right">$8.7M</td>
                    <td className="py-3 px-4 text-right">$22.4M</td>
                  </tr>
                  <tr className="border-b border-[#EED5FB] text-[#CB90F1]">
                    <td className="py-3 px-4 text-[#CB90F1]">Gross Margin</td>
                    <td className="py-3 px-4 text-right">75%</td>
                    <td className="py-3 px-4 text-right">78%</td>
                    <td className="py-3 px-4 text-right">82%</td>
                  </tr>
                  <tr className="border-b border-[#EED5FB] text-[#CB90F1]">
                    <td className="py-3 px-4 text-[#CB90F1]">Customers</td>
                    <td className="py-3 px-4 text-right">850</td>
                    <td className="py-3 px-4 text-right">2,400</td>
                    <td className="py-3 px-4 text-right">5,800</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-[#CB90F1] border-b border-[#CB90F1] pb-2">
              We're Raising $8M
            </h3>
            <div className="bg-[#CB90F1]/10 p-6 rounded-lg text-[#7A3192]">
              <p className="text-lg mb-5">Join our mission to revolutionize the industry</p>
              <div className="flex flex-col md:flex-row justify-around gap-6">
                <div>
                  <div className="text-3xl font-bold text-[#F49C9C]">$5M</div>
                  <div className="text-sm text-[#CB90F1]">Already Committed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#CB90F1]">$3M</div>
                  <div className="text-sm text-[#CB90F1]">Remaining</div>
                </div>
              </div>
              <p className="mt-4 text-lg font-semibold">Contact: <a href="mailto:invest@.com" className="text-[#F18585]">invest@.com</a></p>
            </div>
          </section>

          <div className="mt-8 text-center">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#EED5FB] text-[#7A3192] font-bold shadow hover:bg-[#CB90F1]/10 transition"
            >
              <Download className="w-5 h-5" />
              Extract as PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
