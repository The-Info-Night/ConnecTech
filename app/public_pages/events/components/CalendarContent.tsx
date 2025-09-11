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
      className="flex flex-col items-center justify-center min-h-[70vh] py-8 md:py-16 transition-all duration-300 px-2 sm:px-4 md:px-6 lg:px-8 w-full max-w-6xl mx-auto"
      style={{ paddingLeft: "var(--side-navbar-width, 14rem)" }}
    >
      <h1
        className="text-2xl md:text-3xl font-extrabold mb-8 text-[#b046d4] text-center w-full max-w-4xl drop-shadow-lg"
      >
        Calendar – {currentMonth}
      </h1>
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4">
          {days.map((day) => (
            <div
              key={day}
              className="text-center font-bold text-[#a735f0] text-[10px] xs:text-xs sm:text-base py-1 sm:py-2"
            >
              {day}
            </div>
          ))}
          {dates.map((date) => (
            <div
              key={date}
              className={`
                relative flex items-center justify-center h-10 xs:h-12 sm:h-16 md:h-20
                border-2 rounded-xl border-[#E4BEF8] bg-white/60
                hover:bg-[#F8CACF]/70 transition
              `}
              style={{ minWidth: 0 }}
            >
              <span className="absolute top-1 left-1 text-[10px] xs:text-xs sm:text-sm text-[#CB90F1]">
                {date}
              </span>
              {date === 12 && (
                <span className="text-xs bg-[#D5A8F2] text-[#7A3192] rounded-xl px-2 py-1 absolute bottom-2 left-1/2 -translate-x-1/2 font-bold shadow">
                  Meeting
                </span>
              )}
              {date === 24 && (
                <span className="text-xs bg-[#F6AEAE] text-[#7A3192] rounded-xl px-2 py-1 absolute bottom-2 left-1/2 -translate-x-1/2 font-bold shadow">
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
