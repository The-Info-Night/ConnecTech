"use client";
import SideNavbar from "../../components/SideNavbar";
import NewsListContent from "./components/NewsListContent";

export default function NewsListPage() {
  return (
    <div className="font-sans min-h-screen bg-[#1A1D21]">
      <SideNavbar />
      <NewsListContent />
    </div>
  );
}
