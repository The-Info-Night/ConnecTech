"use client";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  subtitle?: string;
  onClick?: () => void;
}

export default function ProjectCard({
  title,
  description,
  subtitle,
  onClick,
}: ProjectCardProps) {
  return (
    <div 
      className={`bg-[#EED5FB] rounded-2xl shadow-xl border border-[#CB90F1] 
        overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
        cursor-pointer flex flex-col items-center`}
      onClick={onClick}
    >
      <div className="relative h-6 w-full" />
      <div className="p-6 flex flex-col items-center text-center">
        <h3 className="text-2xl font-extrabold text-[#CB90F1] mb-1">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-xs font-bold text-[#F49C9C] mb-2">{subtitle}</p>
        ) : null}
        <p className="text-[#7A3192] text-base font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
