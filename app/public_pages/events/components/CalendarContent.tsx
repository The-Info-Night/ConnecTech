"use client";
import { useState } from "react";

export default function CalendarContent() {
  const [currentMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <main
    className="flex flex-col items-center justify-start min-h-[70vh] py-8 md:py-16 transition-all duration-300 px-2 md:px-8 ml-0 lg:ml-56"
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-8 ml-10 text-gray-900 dark:text-gray-100 text-center w-full max-w-4xl">
        Calendar – {currentMonth}
      </h1>
      <div className="w-full max-w-4xl overflow-x-auto">
        <div className="min-w-[560px] md:min-w-0 grid grid-cols-7 gap-2 md:gap-4">
          {days.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-base py-2"
            >
              {day}
            </div>
          ))}
          {dates.map((date) => (
            <div
              key={date}
              className="relative flex items-center justify-center h-16 sm:h-20 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              style={{ minWidth: 0 }}
            >
              <span className="absolute top-2 left-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {date}
              </span>
              {date === 12 && (
                <span className="text-xs bg-blue-500 text-white rounded px-1 sm:px-2 py-1 absolute bottom-2 left-1/2 -translate-x-1/2">
                  Meeting
                </span>
              )}
              {date === 24 && (
                <span className="text-xs bg-green-500 text-white rounded px-1 sm:px-2 py-1 absolute bottom-2 left-1/2 -translate-x-1/2">
                  Workshop
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
