"use client";
import { useState } from "react";
import SideNavbar from "../../components/SideNavbar";

export default function CalendarPage() {
  const [currentMonth] = useState(new Date().toLocaleString("default", { month: "long", year: "numeric" }));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1); // exemple simple

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black relative">
      <SideNavbar />

      <main
        className="flex flex-col items-center justify-start min-h-[70vh] py-16 ml-0 md:ml-56 transition-all duration-300"
        style={{ marginLeft: "var(--side-navbar-width, 14rem)" }}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Calendar – {currentMonth}
        </h1>

        <div className="grid grid-cols-7 gap-4 w-full max-w-4xl">
          {days.map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 dark:text-gray-300">
              {day}
            </div>
          ))}

          {dates.map((date) => (
            <div
              key={date}
              className="flex items-center justify-center h-20 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
            >
              <span className="absolute top-2 left-2 text-sm text-gray-500 dark:text-gray-400">
                {date}
              </span>
              {date === 12 && (
                <span className="text-xs bg-blue-500 text-white rounded px-2 py-1 absolute bottom-2">
                  Meeting
                </span>
              )}
              {date === 24 && (
                <span className="text-xs bg-green-500 text-white rounded px-2 py-1 absolute bottom-2">
                  Workshop
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
