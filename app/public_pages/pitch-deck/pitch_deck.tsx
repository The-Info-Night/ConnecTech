import { supabase } from "@/lib/supabaseClient";
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
      <div className="font-sans min-h-screen bg-white dark:bg-black">
        {/* Main content */}
        <main className="flex flex-col items-center justify-center min-h-screen py-16 ml-0 md:ml-56 transition-all duration-300"
          style={{ marginLeft: "var(--side-navbar-width, 14rem)" }}
        >
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Connectech Pitch Deck
          </h1>

          {/* Pitch Deck Container */}
          <div
            ref={contentRef}
            className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
          >
            {/* Cover Slide */}
            <div className="text-center mb-12 border-b pb-8">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Connectech
              </h2>
              <p className="text-2xl text-gray-700 mb-6">Revolutionizing the Future of Technology</p>
              <p className="text-gray-500">Pitch Deck | 2025</p>
            </div>

            {/* Problem Slide */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">The Problem</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 text-2xl">•</span>
                  <span>Current solutions are inefficient and outdated</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 text-2xl">•</span>
                  <span>Businesses lose $X billion annually due to inefficiencies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 text-2xl">•</span>
                  <span>No integrated platform addresses all customer needs</span>
                </li>
              </ul>
            </div>

            {/* Solution Slide */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">Our Solution</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-2xl font-semibold mb-4 text-blue-800">The Connectech Platform</h4>
                <p className="text-lg mb-4">A comprehensive SaaS solution that:</p>
                <ul className="grid grid-cols-2 gap-4">
                  <li className="flex items-center">
                    <span className="bg-blue-100 p-2 rounded-full mr-3">✓</span>
                    Increases efficiency by 40%
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 p-2 rounded-full mr-3">✓</span>
                    Reduces costs by 30%
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 p-2 rounded-full mr-3">✓</span>
                    Improves customer satisfaction
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 p-2 rounded-full mr-3">✓</span>
                    Scalable architecture
                  </li>
                </ul>
              </div>
            </div>

            {/* Market Slide */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">Market Opportunity</h3>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">$42B</div>
                  <div className="text-gray-600">Total Addressable Market</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">$12B</div>
                  <div className="text-gray-600">Serviceable Addressable Market</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">$850M</div>
                  <div className="text-gray-600">Serviceable Obtainable Market</div>
                </div>
              </div>
            </div>

            {/* Traction Slide */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">Traction</h3>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">42%</div>
                  <div className="text-gray-600">MoM Growth</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">250+</div>
                  <div className="text-gray-600">Active Clients</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">98%</div>
                  <div className="text-gray-600">Retention Rate</div>
                </div>
              </div>
              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold mb-2 text-green-800">Recent Milestones</h4>
                <ul className="list-disc list-inside">
                  <li>Closed $5M Series A funding</li>
                  <li>Launched v2.0 with AI capabilities</li>
                  <li>Partnership with Industry Leader Inc.</li>
                </ul>
              </div>
            </div>

            {/* Business Model Slide */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">Business Model</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-blue-800 mb-2">SaaS Subscription</h4>
                  <p className="text-2xl font-bold">$99-499/mo</p>
                  <p className="text-sm text-gray-600">Tiered pricing</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-green-800 mb-2">Enterprise</h4>
                  <p className="text-2xl font-bold">Custom</p>
                  <p className="text-sm text-gray-600">White-label solutions</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-purple-800 mb-2">Marketplace</h4>
                  <p className="text-2xl font-bold">15% fee</p>
                  <p className="text-sm text-gray-600">Transaction commission</p>
                </div>
              </div>
            </div>

            {/* Team Slide */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">Our Team</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-200 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-xl font-semibold">JD</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Jane Doe</h4>
                    <p className="text-gray-600">CEO, Former Google PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-green-200 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-xl font-semibold">JS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Smith</h4>
                    <p className="text-gray-600">CTO, Ex-Microsoft</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-purple-200 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-xl font-semibold">AJ</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Alice Johnson</h4>
                    <p className="text-gray-600">CPO, UX Expert</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-yellow-200 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-xl font-semibold">RS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Robert Brown</h4>
                    <p className="text-gray-600">CFO, Financial Strategist</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Projections Slide */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">Financial Projections</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left">Metric</th>
                      <th className="py-3 px-4 text-right">2024</th>
                      <th className="py-3 px-4 text-right">2025</th>
                      <th className="py-3 px-4 text-right">2026</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Revenue</td>
                      <td className="py-3 px-4 text-right">$2.5M</td>
                      <td className="py-3 px-4 text-right">$8.7M</td>
                      <td className="py-3 px-4 text-right">$22.4M</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Gross Margin</td>
                      <td className="py-3 px-4 text-right">75%</td>
                      <td className="py-3 px-4 text-right">78%</td>
                      <td className="py-3 px-4 text-right">82%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Customers</td>
                      <td className="py-3 px-4 text-right">850</td>
                      <td className="py-3 px-4 text-right">2,400</td>
                      <td className="py-3 px-4 text-right">5,800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ask Slide */}
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">We're Raising $8M</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-xl mb-4">Join our mission to revolutionize the industry</p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">$5M</div>
                    <div className="text-gray-600">Already Committed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">$3M</div>
                    <div className="text-gray-600">Remaining</div>
                  </div>
                </div>
                <p className="text-lg font-semibold">Contact: <span className="text-blue-600">invest@.com</span></p>
              </div>
            </div>
          </div>

          <div className="group mt-8">
            <button
                onClick={handleExport}
                className="mt-6 flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg group-hover:shadow-xl group-hover:-translate-y-0.5"
            >
                <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Export Pitch Deck as PDF
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