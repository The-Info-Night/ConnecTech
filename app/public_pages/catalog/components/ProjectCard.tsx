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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48">
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{subtitle}</p>
        ) : null}
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}