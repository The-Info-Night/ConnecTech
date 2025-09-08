"use client";
import SideNavbar from "../../../components/SideNavbar";
import NewsDetailContent from "../components/NewsDetailContent";

export default function NewsDetailPage() {
  return (
    <div className="font-sans min-h-screen bg-[#1A1B21] dark:bg-[#1A1B21]">
      <SideNavbar />
      <NewsDetailContent />
    </div>
  );
}
