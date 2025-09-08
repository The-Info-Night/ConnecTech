"use client";
import SideNavbar from "../../components/SideNavbar";
import CalendarContent from "./components/CalendarContent";

export default function CalendarPage() {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black relative">
      <SideNavbar />
      <CalendarContent />
    </div>
  );
}
